import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    eventsApi.getAll({ limit })
      .then(({ data: { data } }) => setEvents(data))
      .catch(() => {});
  }, [limit]);

  return (
    <section className="w-full py-12" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            {title}
          </h2>
          <p className="mt-2 text-base font-medium" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <FeaturedEventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/categorias"
            className="text-base font-semibold hover:underline"
            style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}
          >
            Ver todos los eventos →
          </Link>
        </div>
      </div>
    </section>
  );
}
