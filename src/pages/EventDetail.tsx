import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { eventsApi, adminApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  ArrowLeft,
  Share2,
  Camera,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SocialPostMedia } from '../features/social/SocialPostMedia';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      eventsApi.getBySlug(slug).then(({ data }) => {
        setEvent(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <p className="text-sm" style={{ color: '#1D1D1F99' }}>Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">

        <Link
          to="/categorias"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70"
          style={{ color: '#2563EB' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a eventos
        </Link>

        {/* Card principal */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>

          {/* Imagen */}
          {event.imageUrl && (
            <div className="h-56 md:h-72 overflow-hidden">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8">

            {/* Título y badges */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {event.category && (
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#E4EBFA', color: '#2563EB' }}
                    >
                      {event.category.name}
                    </span>
                  )}
                  {event.isOnline && (
                    <span
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                    >
                      <Globe className="w-3 h-3" />
                      Online
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
                  {event.title}
                </h1>
              </div>
              <button
                type="button"
                className="p-2 rounded-xl border ml-3 transition-colors cursor-pointer"
                style={{ borderColor: '#E4EBFA', backgroundColor: '#F8FAFC' }}
                onClick={() => navigator.share?.({ title: event.title, url: window.location.href })}
              >
                <Share2 className="w-5 h-5" style={{ color: '#1D1D1F99' }} />
              </button>
            </div>

            {/* Info fecha / lugar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E4EBFA' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#E4EBFA' }}>
                  <Calendar className="w-4 h-4" style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: '#1D1D1F99' }}>Fecha</p>
                  <p className="text-sm font-semibold capitalize" style={{ color: '#1D1D1F' }}>
                    {format(new Date(event.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" style={{ color: '#2563EB' }} />
                    <p className="text-xs" style={{ color: '#1D1D1F99' }}>
                      {format(new Date(event.date), "HH:mm 'hrs'", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>

              {(event.locationName || event.city) && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#E4EBFA' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#2563EB' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: '#1D1D1F99' }}>Lugar</p>
                    {event.locationName && (
                      <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>{event.locationName}</p>
                    )}
                    {event.address && (
                      <p className="text-xs mt-0.5" style={{ color: '#1D1D1F99' }}>{event.address}</p>
                    )}
                    {event.city && (
                      <p className="text-xs" style={{ color: '#1D1D1F99' }}>{event.city}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-2" style={{ color: '#1D1D1F' }}>Descripción</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#1D1D1F99' }}>{event.description}</p>
            </div>

            {event.content && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-2" style={{ color: '#1D1D1F' }}>Detalles</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#1D1D1F99' }}>{event.content}</p>
              </div>
            )}


            {/* Feed de Instagram */}
            {event.socialFeed && event.socialFeed.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#1D1D1F' }}>
                  <Sparkles className="w-4 h-4" style={{ color: '#2563EB' }} />
                  Publicaciones de Instagram
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.socialFeed.map((post, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E4EBFA' }}>
                      {post.media_url && (
                        <div className="overflow-hidden" style={{ height: '176px' }}>
                          <SocialPostMedia post={post} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3">
                        {post.caption && (
                          <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: '#1D1D1F99' }}>{post.caption}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#1D1D1F66' }}>
                            <Camera className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
                            {format(new Date(post.timestamp), "dd MMM yyyy", { locale: es })}
                          </span>
                          {post.permalink && (
                            <a
                              href={post.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => { if (isAuthenticated) adminApi.trackInstagramClick(event?.id).catch(() => {}); }}
                              className="flex items-center gap-1 text-xs font-medium hover:underline"
                              style={{ color: '#2563EB' }}
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
              </div>
            )}

            {/* Botón Ir a Instagram */}
            {(() => {
              const igUrl = event.owner?.instagramUsername
                ? `https://www.instagram.com/${event.owner.instagramUsername}`
                : event.socialFeed?.[0]?.permalink || null;
              const igLabel = event.owner?.instagramUsername
                ? `@${event.owner.instagramUsername}`
                : null;

              if (!igUrl && !event.owner?.instagramId) return null;

              return (
                <div className="pt-4" style={{ borderTop: '1px solid #E4EBFA' }}>
                  <a
                    href={igUrl || `https://www.instagram.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { if (isAuthenticated) adminApi.trackInstagramClick(event?.id).catch(() => {}); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    <Camera className="w-4 h-4" />
                    Ir a Instagram
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {igLabel && (
                    <p className="mt-1.5 text-xs" style={{ color: '#1D1D1F99' }}>{igLabel}</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}
