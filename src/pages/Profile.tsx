import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { eventsApi, socialApi, attendeesApi } from '../api';
import EventCard from '../components/EventCard';
import type { Event } from '../types';
import {
  Camera,
  MessageCircle,
  Link2,
  Unlink,
  Calendar,
  Sparkles,
  LogOut,
  RefreshCw,
  CalendarCheck,
  Clock,
  Shield,
  User,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Tab = 'myevents' | 'registered';

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('myevents');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [socialStatus, setSocialStatus] = useState({ facebook: false, instagram: false });
  const [connecting, setConnecting] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    Promise.all([
      eventsApi.getByOwner(),
      attendeesApi.findByUser(),
      socialApi.getStatus(),
    ])
      .then(([eventsRes, attendeesRes, socialRes]) => {
        setMyEvents(eventsRes.data);
        setRegisteredEvents(attendeesRes.data?.map((a: any) => a.event) || []);
        setSocialStatus(socialRes.data);
      })
      .catch(() => {});
  }, [isAuthenticated, navigate]);

  const handleSocialConnect = async (platform: 'facebook' | 'instagram') => {
    setConnecting(platform);
    try {
      if (socialStatus[platform]) {
        await socialApi.disconnect(platform);
        setSocialStatus((prev) => ({ ...prev, [platform]: false }));
      } else if (showTokenInput === platform && tokenInput) {
        await socialApi[platform === 'facebook' ? 'facebookConnect' : 'instagramConnect']({
          platform,
          accessToken: tokenInput,
        });
        setSocialStatus((prev) => ({ ...prev, [platform]: true }));
        setShowTokenInput(null);
        setTokenInput('');
      } else {
        setShowTokenInput(platform);
      }
    } catch {
      alert(`Error al conectar ${platform}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleInstagramOAuth = async () => {
    try {
      const { data } = await socialApi.getInstagramAuthUrl();
      window.location.href = data.url;
    } catch {
      alert('Error al obtener URL de autorización');
    }
  };

  const handleSync = async (eventId: string) => {
    setSyncing(eventId);
    try {
      await socialApi.syncFeed(eventId);
      const { data } = await eventsApi.getByOwner();
      setMyEvents(data);
    } catch {
      alert('Error al sincronizar Instagram');
    } finally {
      setSyncing(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Calendar; count: number }[] = [
    { key: 'myevents', label: 'Mis Eventos', icon: Calendar, count: myEvents.length },
    { key: 'registered', label: 'Inscripciones', icon: CalendarCheck, count: registeredEvents.length },
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
                    {(user.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-xl font-bold text-white">{user.name}</h1>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-neon-cyan bg-white/5 px-3 py-1 rounded-full">
                    {user.role === 'ORGANIZER' ? 'Organizador' : user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
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

                {/* Social */}
                <div>
                  <h2 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-neon-cyan" />
                    Redes Sociales
                  </h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSocialConnect('facebook')}
                      disabled={connecting === 'facebook'}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                        socialStatus.facebook
                          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                          : 'glass text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5" />
                        <span>Facebook</span>
                      </div>
                      {socialStatus.facebook ? <Unlink className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSocialConnect('instagram')}
                      disabled={connecting === 'instagram'}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                        socialStatus.instagram
                          ? 'bg-pink-500/10 border border-pink-500/20 text-pink-400'
                          : 'glass text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5" />
                        <span>Instagram</span>
                      </div>
                      {socialStatus.instagram ? <Unlink className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    </button>

                    {showTokenInput === 'instagram' && !socialStatus.instagram && (
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={handleInstagramOAuth}
                          disabled={connecting === 'instagram'}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                        >
                          Conectar con Instagram
                        </button>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-[#0f0f1a] px-2 text-gray-500">o con token</span>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value)}
                          placeholder="Pega tu token de acceso aquí"
                          className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSocialConnect('instagram')}
                            disabled={!tokenInput || connecting === 'instagram'}
                            className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                          >
                            {connecting === 'instagram' ? 'Conectando...' : 'Usar token'}
                          </button>
                          <button
                            onClick={() => { setShowTokenInput(null); setTokenInput(''); }}
                            className="py-1.5 px-3 rounded-xl glass text-gray-400 text-xs hover:text-white transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-white/5 my-4" />

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Miembro desde {format(new Date(user.createdAt), "MMMM yyyy", { locale: es })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Rol: {user.role === 'ORGANIZER' ? 'Organizador' : user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                  </div>
                </div>

                <hr className="border-white/5 my-4" />

                <button
                  onClick={() => { logout(); navigate('/'); }}
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
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      tab === key ? 'bg-white/10' : 'bg-white/5'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Events */}
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
                      {tab === 'myevents' && socialStatus.instagram && (
                        <button
                          onClick={() => handleSync(event.id)}
                          disabled={syncing === event.id}
                          className="absolute top-2 right-2 p-2 rounded-lg glass text-gray-400 hover:text-neon-cyan transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Sincronizar Instagram"
                        >
                          <RefreshCw className={`w-4 h-4 ${syncing === event.id ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
