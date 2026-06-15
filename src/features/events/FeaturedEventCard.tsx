import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Event } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function getCategoryStyle() {
  return { bg: '#FFFFFF', text: '#1D1D1F' };
}

interface Props {
  event: Event;
}

export function FeaturedEventCard({ event }: Props) {
  const isFree = !event.price || event.price === 0;
  const eventDate = new Date(event.date);
  const catStyle = getCategoryStyle();

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E4EBFA' }}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        ) : (
          <div className="w-full flex items-center justify-center" style={{ aspectRatio: '4/5', backgroundColor: '#E4EBFA' }}>
            <span style={{ color: '#1D1D1F33', fontSize: '13px' }}>Sin imagen</span>
          </div>
        )}

        {/* Badge categoría */}
        {event.category && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: catStyle.bg, color: catStyle.text, border: '1px solid #E4EBFA', fontFamily: 'var(--font-brand)' }}
          >
            {event.category.name}
          </span>
        )}

        {/* Badge gratuito */}
        {isFree && (
          <span
            className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#1D1D1F', border: '1px solid #E4EBFA', fontFamily: 'var(--font-brand)' }}
          >
            Gratis
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-3">
        <h3
          className="font-semibold text-sm leading-snug line-clamp-2"
          style={{ color: '#1D1D1F', fontFamily: 'var(--font-brand)' }}
        >
          {event.title}
        </h3>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: '#2563EB' }} />
            <span className="text-xs" style={{ color: '#1D1D1F99', fontFamily: 'var(--font-brand)' }}>
              {format(eventDate, "dd 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2563EB' }} />
            <span className="text-xs" style={{ color: '#1D1D1F99', fontFamily: 'var(--font-brand)' }}>
              {format(eventDate, 'HH:mm')} hs
            </span>
          </div>
          {(event.city || event.locationName) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#2563EB' }} />
              <span className="text-xs" style={{ color: '#1D1D1F99', fontFamily: 'var(--font-brand)' }}>
                {event.city || event.locationName}
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/categorias/${event.slug}`}
          className="inline-flex items-center gap-1 px-5 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 self-start"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF', fontFamily: 'var(--font-brand)' }}
        >
          Ver más →
        </Link>
      </div>
    </div>
  );
}
