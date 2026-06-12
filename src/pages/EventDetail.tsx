import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { eventsApi, attendeesApi, socialApi, adminApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  ArrowLeft,
  Share2,
  Camera,
  MessageCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      eventsApi.getBySlug(slug).then(({ data }) => {
        setEvent(data);
        setLoading(false);
      });
    }
  }, [slug]);

  const handleRegister = async () => {
    if (!user || !event) return;
    try {
      await attendeesApi.register(event.id);
      setRegistered(true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              attendees: [
                ...(prev.attendees || []),
                { id: '', userId: user.id, eventId: event.id, status: 'REGISTERED', user },
              ],
            }
          : prev
      );
    } catch {
      alert('Ya estás registrado o ocurrió un error');
    }
  };

  const handleSync = async () => {
    if (!event) return;
    setSyncing(true);
    try {
      const { data } = await socialApi.syncFeed(event.id);
      setEvent((prev) => prev ? { ...prev, socialFeed: data.socialFeed, lastSync: data.lastSync } : prev);
    } catch {
      alert('Error al sincronizar Instagram. Asegúrate de tener Instagram conectado en tu perfil.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-400">Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-cyan/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-20">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a eventos
          </Link>

          <div className="glass rounded-2xl overflow-hidden glow-purple">
            {event.imageUrl && (
              <div className="h-48 md:h-64 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {event.category && (
                      <span className="text-xs font-medium text-neon-cyan bg-white/5 px-2.5 py-1 rounded-full">
                        {event.category.name}
                      </span>
                    )}
                    {event.isOnline && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <Globe className="w-3 h-3" />
                        Online
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    {event.title}
                  </h1>
                </div>
                <button type="button" className="p-2 rounded-xl glass text-gray-400 hover:text-neon-cyan transition-all cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neon-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Fecha</p>
                    <p className="text-sm text-white font-medium">
                      {format(new Date(event.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), "HH:mm 'hrs'", { locale: es })}
                    </p>
                  </div>
                </div>

                {event.locationName && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neon-purple mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Lugar</p>
                      <p className="text-sm text-white font-medium">{event.locationName}</p>
                      {event.address && (
                        <p className="text-sm text-gray-500">{event.address}</p>
                      )}
                      {event.city && (
                        <p className="text-sm text-gray-500">{event.city}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-sm font-medium text-gray-300 mb-2">Descripción</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
              </div>

              {event.content && (
                <div className="mb-8">
                  <h2 className="text-sm font-medium text-gray-300 mb-2">Detalles</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{event.content}</p>
                </div>
              )}

              {user && event.owner?.id === user.id && (
                <div className="mb-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar Instagram'}
                  </button>
                  {event.lastSync && (
                    <span className="text-xs text-gray-500">
                      Última sincronización: {format(new Date(event.lastSync), "dd MMM yyyy HH:mm", { locale: es })}
                    </span>
                  )}
                </div>
              )}
              {event.socialFeed && event.socialFeed.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                    Publicaciones de Redes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.socialFeed.map((post, i) => (
                      <div key={i} className="glass rounded-xl p-4">
                        {post.media_url && (
                          <img
                            src={post.media_url}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <p className="text-sm text-gray-400 mb-2">{post.caption}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {post.platform === 'instagram' ? (
                              <Camera className="w-4 h-4 inline mr-1 text-neon-pink" />
                            ) : (
                              <MessageCircle className="w-4 h-4 inline mr-1 text-blue-400" />
                            )}
                            {format(new Date(post.timestamp), "dd MMM", { locale: es })}
                          </span>
                          {post.permalink && (
                            <a
                              href={post.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => { if (isAuthenticated) adminApi.trackInstagramClick(event?.id).catch(() => {}); }}
                              className="text-xs text-neon-cyan hover:underline"
                            >
                              Ver original
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  registered ? (
                    <span className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Ya registrado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      Registrarme
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass text-sm text-gray-300 hover:text-white transition-all"
                  >
                    <Users className="w-4 h-4" />
                    Inicia sesión para registrarte
                  </Link>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  {event.attendees?.length || 0} asistente{(event.attendees?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {event.attendees && event.attendees.length > 0 && (
            <div className="glass rounded-2xl p-6 mt-6 glow-cyan">
              <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-neon-cyan" />
                Asistentes ({event.attendees.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((a) => (
                  <span
                    key={a.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm text-gray-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-[8px] font-bold text-white">
                      {a.user.name.charAt(0).toUpperCase()}
                    </div>
                    {a.user.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
