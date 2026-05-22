import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { eventsApi, socialApi } from '../api';
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
} from 'lucide-react';

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [socialStatus, setSocialStatus] = useState({ facebook: false, instagram: false });
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    eventsApi.getByOwner().then(({ data }) => setMyEvents(data));
    socialApi.getStatus().then(({ data }) => setSocialStatus(data)).catch(() => {});
  }, [isAuthenticated, navigate]);

  const handleSocialConnect = async (platform: 'facebook' | 'instagram') => {
    setConnecting(platform);
    try {
      if (socialStatus[platform]) {
        await socialApi.disconnect(platform);
        setSocialStatus((prev) => ({ ...prev, [platform]: false }));
      } else {
        const token = prompt(`Ingresa tu token de acceso de ${platform}:`);
        if (!token) return;
        await socialApi[platform === 'facebook' ? 'facebookConnect' : 'instagramConnect']({
          platform,
          accessToken: token,
        });
        setSocialStatus((prev) => ({ ...prev, [platform]: true }));
      }
    } catch {
      alert(`Error al conectar ${platform}`);
    } finally {
      setConnecting(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon-pink/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 glow-pink sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center text-3xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-xl font-bold text-white">{user.name}</h1>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-neon-cyan bg-white/5 px-2.5 py-1 rounded-full">
                    {user.role === 'ORGANIZER' ? 'Organizador' : user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                  </span>
                </div>

                <hr className="border-white/5 my-4" />

                <div>
                  <h2 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-neon-cyan" />
                    Redes Sociales
                  </h2>
                  <div className="space-y-3">
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
                      {socialStatus.facebook ? (
                        <Unlink className="w-4 h-4" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
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
                      {socialStatus.instagram ? (
                        <Unlink className="w-4 h-4" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <hr className="border-white/5 my-4" />

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-gray-400 hover:text-neon-pink transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neon-cyan" />
                  Mis Eventos
                </h2>
                <span className="text-sm text-gray-400">{myEvents.length} evento{myEvents.length !== 1 ? 's' : ''}</span>
              </div>

              {myEvents.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No has publicado eventos aún</p>
                  <a
                    href="/create-event"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Publicar mi primer evento
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
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
