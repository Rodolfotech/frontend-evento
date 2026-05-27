import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi } from '../api';
import EventCard from '../components/EventCard';
import CreateEventForm from '../components/events/CreateEventForm';
import type { Event, SocialPost } from '../types';
import {
  Camera,
  Calendar,
  Sparkles,
  RefreshCw,
  CalendarCheck,
  Search,
  ExternalLink,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Tab = 'myevents' | 'registered' | 'instagram';

export default function CreateEventPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('myevents');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<SocialPost[]>([]);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramAvatar, setInstagramAvatar] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [filter, setFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const updateInstagramStatus = useCallback(({ data }: { data: { instagram: boolean; instagramUsername: string | null; instagramAvatar: string | null } }) => {
    setInstagramConnected(data.instagram);
    setInstagramUsername(data.instagramUsername);
    setInstagramAvatar(data.instagramAvatar);
  }, []);

  const loadUser = useCallback(() => {
    eventsApi.getByOwner()
      .then((eventsRes) => setMyEvents(eventsRes.data))
      .catch(() => undefined);
    attendeesApi.findByUser()
      .then((attendeesRes) => setRegisteredEvents(attendeesRes.data?.map((a: { event: Event }) => a.event) || []))
      .catch(() => undefined);
    socialApi.getStatus()
      .then(updateInstagramStatus)
      .catch(() => undefined);
  }, [updateInstagramStatus]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUser();
  }, [isAuthenticated, navigate, loadUser]);

  const handleInstagramLink = async () => {
    try {
      const { data } = await socialApi.getInstagramAuthUrl();
      const w = 600, h = 700;
      const x = window.screenX + (window.innerWidth - w) / 2;
      const y = window.screenY + (window.innerHeight - h) / 2;
      window.open(
        data.url,
        'instagram-auth',
        `width=${w},height=${h},left=${x},top=${y},popup=1`,
      );
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    if (tab !== 'instagram') return;
    socialApi.getUserMedia()
      .then(({ data }) => setInstagramPosts(data))
      .catch(() => undefined);
  }, [tab]);

  const filteredPosts = instagramPosts.filter((p) =>
    !filter || (p.caption || '').toLowerCase().includes(filter.toLowerCase()),
  );

  const tabs: { key: Tab; label: string; icon: typeof Calendar; count?: number }[] = [
    { key: 'myevents', label: 'Mis Eventos', icon: Calendar, count: myEvents.length },
    { key: 'registered', label: 'Inscripciones', icon: CalendarCheck, count: registeredEvents.length },
    { key: 'instagram', label: 'Instagram', icon: Camera, count: instagramPosts.length },
  ];

  const displayEvents = tab === 'myevents' ? myEvents : registeredEvents;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
              Mis Eventos
            </h1>
            <p className="text-gray-400 mt-2">Administra tus publicaciones y contenido</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 glass rounded-xl p-1">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  tab === key
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tab === key ? 'bg-white/10' : 'bg-white/5'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Instagram Tab */}
          {tab === 'instagram' && (
            <div>
              {instagramUsername && (
                <div className="flex items-center gap-2 mb-4">
                  {instagramAvatar && (
                    <img src={instagramAvatar} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-sm text-gray-300">@{instagramUsername}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Buscar en captions..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => {
                    setLoadingPosts(true);
                    socialApi.getUserMedia()
                      .then(({ data }) => setInstagramPosts(data))
                      .catch(() => {})
                      .finally(() => setLoadingPosts(false));
                  }}
                  disabled={loadingPosts}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPosts ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              {loadingPosts ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">
                    {filter ? 'No hay publicaciones que coincidan con tu búsqueda' : 'Aún no hay publicaciones en Instagram'}
                  </p>
                  {!instagramConnected && (
                    <button
                      onClick={handleInstagramLink}
                      className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium cursor-pointer"
                    >
                      Vincular Instagram
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="glass rounded-xl overflow-hidden group">
                      {post.media_url && (
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={post.media_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {post.caption && (
                          <p className="text-sm text-gray-400 mb-2 line-clamp-3">{post.caption}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {format(new Date(post.timestamp), "dd MMM yyyy", { locale: es })}
                          </span>
                          {post.permalink && (
                            <a
                              href={post.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-neon-cyan hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ver en Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events tabs */}
          {(tab === 'myevents' || tab === 'registered') && (
            <>
              {displayEvents.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center">
                    {tab === 'myevents' ? (
                      <Sparkles className="w-8 h-8 text-gray-500" />
                    ) : (
                      <CalendarCheck className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <p className="text-gray-400 mb-2">
                    {tab === 'myevents' ? 'No has publicado eventos aún' : 'No te has inscrito a ningún evento'}
                  </p>
                  {tab === 'myevents' ? (
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Publicar mi primer evento
                    </button>
                  ) : (
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Explorar eventos
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayEvents.map((event) => (
                    <div key={event.id} className="relative group">
                      <EventCard event={event} />
                      {tab === 'myevents' && instagramConnected && (
                        <button
                          onClick={async () => {
                            try {
                              await socialApi.syncFeed(event.id);
                              const { data } = await eventsApi.getByOwner();
                              setMyEvents(data);
                            } catch {
                              /* noop */
                            }
                          }}
                          className="absolute top-2 right-2 p-2 rounded-lg glass text-gray-400 hover:text-neon-cyan transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Sincronizar Instagram"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Create event button (always visible when user has events) */}
          {tab === 'myevents' && myEvents.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Publicar nuevo evento
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dark-800 border border-white/10 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-dark-800/80 backdrop-blur-sm border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Publicar Evento</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-lg glass text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <CreateEventForm
                showHeader={false}
                onSuccess={() => {
                  setCreateModalOpen(false);
                  loadUser();
                }}
                onCancel={() => setCreateModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
