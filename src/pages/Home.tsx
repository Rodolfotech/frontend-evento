import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api';
import { getCached, setCached } from '../api/eventsCache';
import { HeroSearch } from '../features/events/HeroSearch';
import { FeaturedEventCard } from '../features/events/FeaturedEventCard';
import { EventCardSkeleton } from '../components/ui/EventCardSkeleton';
import { CategoryGrid } from '../features/events/CategoryGrid';
import { ComunaGrid } from '../features/events/ComunaGrid';
import { UpcomingEventsCarousel } from '../features/events/UpcomingEventsCarousel';
import { OrganizerCTA } from '../features/events/OrganizerCTA';
import type { Event } from '../types';

const FEATURED_PARAMS = {
  limit: 8,
  dateFrom: new Date().toISOString().split('T')[0],
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached<Event[]>(FEATURED_PARAMS);
    if (cached) {
      setEvents(cached);
      setLoading(false);
    }

    eventsApi.getAll(FEATURED_PARAMS)
      .then(({ data: { data } }) => {
        setEvents(data);
        setCached(FEATURED_PARAMS, data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showSkeletons = loading && events.length === 0;

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FFFFFF' }}>
      <HeroSearch />

      {/* Eventos destacados */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            Eventos destacados
          </h2>
          <p className="mt-2 text-base font-medium" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            Experiencias únicas que no te puedes perder
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showSkeletons
            ? Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)
            : events.map((event) => <FeaturedEventCard key={event.id} event={event} />)
          }
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
      </section>

      <CategoryGrid />
      <ComunaGrid />
      <UpcomingEventsCarousel />
      <OrganizerCTA />
    </div>
  );
}
