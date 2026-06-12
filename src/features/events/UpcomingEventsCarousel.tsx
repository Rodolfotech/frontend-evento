import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { eventsApi } from '../../api';
import { FeaturedEventCard } from './FeaturedEventCard';
import type { Event } from '../../types';

interface Props {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function UpcomingEventsCarousel({
  title = 'Próximos eventos',
  subtitle = 'Experiencias únicas que no te puedes perder',
  limit = 8,
}: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    eventsApi.getAll({ limit, dateFrom: today })
      .then(({ data: { data } }) => setEvents(data))
      .catch(() => {});
  }, [limit]);

  function scrollRight() {
    carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  if (events.length === 0) return null;

  return (
    <section className="w-full py-12" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            {title}
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#1D1D1F99' }}>
            {subtitle}
          </p>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {events.map((event) => (
              <div key={event.id} className="shrink-0 w-64">
                <FeaturedEventCard event={event} />
              </div>
            ))}
          </div>

          {events.length > 4 && (
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Ver más eventos"
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#2563EB' }} />
            </button>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/categorias"
            className="text-sm font-medium hover:underline"
            style={{ color: '#2563EB' }}
          >
            Ver todos los eventos →
          </Link>
        </div>
      </div>
    </section>
  );
}
