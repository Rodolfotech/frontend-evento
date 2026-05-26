import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsApi, socialApi, attendeesApi } from '../api';
import EventCard from '../components/EventCard';
import { SocialPostCard } from '../components/social/SocialPostCard';
import { InstagramConnectButton } from '../components/social/InstagramConnectButton';
import { InstagramLinkModal } from '../components/social/InstagramLinkModal';
import { InstagramBadges } from '../components/social/InstagramBadges';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Toast } from '../components/ui/Toast';
import type { Event, SocialPost } from '../types';
import {
  Camera,
  Calendar,
  Sparkles,
  LogOut,
  RefreshCw,
  CalendarCheck,
  Clock,
  Shield,
  Search,
  Link2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Tab = 'myevents' | 'registered' | 'instagram';

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('myevents');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<SocialPost[]>([]);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramAvatar, setInstagramAvatar] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [filter, setFilter] = useState('');
  const [validation, setValidation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const updateInstagramStatus = useCallback(({ data }: any) => {
    setInstagramConnected(data.instagram);
    setInstagramUsername(data.instagramUsername);
    setInstagramAvatar(data.instagramAvatar);
  }, []);

  const handleLinkSuccess = useCallback(() => {
    setToast({ message: 'Vinculación con Instagram correcta', type: 'success' });
    socialApi.getStatus().then(updateInstagramStatus).catch(() => {});
    loadUser();
  }, [updateInstagramStatus]);

  const handleLinkError = useCallback((msg: string) => {
    setToast({ message: msg, type: 'error' });
  }, []);

  const loadUser = () => {
    Promise.all([
      eventsApi.getByOwner(),
      attendeesApi.findByUser(),
      socialApi.getStatus().then(updateInstagramStatus).catch(() => {}),
    ])
      .then(([eventsRes, attendeesRes]) => {
        setMyEvents(eventsRes.data);
        setRegisteredEvents(attendeesRes.data?.map((a: any) => a.event) || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (instagramConnected) {
      socialApi.getValidation().then(({ data }) => setValidation(data)).catch(() => {});
    }
  }, [instagramConnected]);

  useEffect(() => {
    if (tab === 'instagram') {
      setLoadingPosts(true);
      socialApi.getUserMedia()
        .then(({ data }) => setInstagramPosts(data))
        .catch(() => {})
        .finally(() => setLoadingPosts(false));
    }
  }, [tab]);

  const filteredPosts = instagramPosts.filter((post) =>
    !filter || (post.caption || '').toLowerCase().includes(filter.toLowerCase()),
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

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 glow-pink sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-neon-purple/20">
                    {(user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-xl font-bold text-white">{user?.name}</h1>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  {user?.instagramId && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">
                      <Camera className="w-3 h-3" />
                      Instagram conectado
                    </span>
                  )}
                  <InstagramBadges validation={validation} />
                  <span className="inline-block mt-2 text-xs font-medium text-neon-cyan bg-white/5 px-3 py-1 rounded-full">
                    {user?.role === 'ORGANIZER' ? 'Organizador' : user?.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">{myEvents.length}</p>
                    <p className="text-xs text-gray-400">Eventos</p>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">{registeredEvents.length}</p>
                    <p className="text-xs text-gray-400">Inscripciones</p>
                  </div>
                </div>

                <hr className="border-white/5 my-4" />

                <div className="mb-4">
                  <h2 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-neon-cyan" />
                    Redes Sociales
                  </h2>
                  <InstagramConnectButton
                    connected={instagramConnected}
                    username={instagramUsername}
                    avatar={instagramAvatar}
                    onConnect={() => setShowModal(true)}
                    onDisconnect={async () => {
                      try {
                        await socialApi.disconnect('instagram');
                        setInstagramConnected(false);
                        setInstagramUsername(null);
                        setInstagramAvatar(null);
                        setValidation(null);
                        loadUser();
                        setToast({ message: 'Instagram desvinculado correctamente', type: 'success' });
                      } catch {
                        setToast({ message: 'Error al desvincular Instagram', type: 'error' });
                      }
                    }}
                    onChangeAccount={() => {
                      setShowModal(true);
                    }}
                  />
                </div>

                <hr className="border-white/5 my-4" />

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Miembro desde {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy", { locale: es }) : ''}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Rol: {user?.role === 'ORGANIZER' ? 'Organizador' : user?.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                  </div>
                </div>

                <hr className="border-white/5 my-4" />

                <button
                  onClick={() => { logout(); window.location.href = '/'; }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-gray-400 hover:text-neon-pink hover:border-neon-pink/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2">
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
                      <LoadingSpinner color="pink" />
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="glass rounded-2xl p-16 text-center">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">
                        {filter ? 'No hay publicaciones que coincidan con tu búsqueda' : 'Aún no hay publicaciones en Instagram'}
                      </p>
                      {!instagramConnected && (
                        <button
                          onClick={() => setShowModal(true)}
                          className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium cursor-pointer"
                        >
                          Vincular Instagram
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredPosts.map((post) => (
                        <SocialPostCard key={post.id} post={post} />
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
                      <a
                        href={tab === 'myevents' ? '/create-event' : '/events'}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        {tab === 'myevents' ? 'Publicar mi primer evento' : 'Explorar eventos'}
                      </a>
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
                                } catch {}
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
            </div>
          </div>
        </div>
      </div>
      <InstagramLinkModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLinkSuccess}
        onError={handleLinkError}
      />
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        visible={!!toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
