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

const FEATURED_PARAMS = { limit: 8, dateFrom: new Date().toISOString().split('T')[0] };
const UPCOMING_PARAMS = { limit: 8 };

export default function Home() {
  const [featured, setFeatured] = useState<Event[]>(() => getCached<Event[]>(FEATURED_PARAMS) ?? []);
  const [upcoming, setUpcoming] = useState<Event[]>(() => getCached<Event[]>(UPCOMING_PARAMS) ?? []);
  const [loading, setLoading] = useState(
    () => getCached<Event[]>(FEATURED_PARAMS) === null || getCached<Event[]>(UPCOMING_PARAMS) === null
  );

  useEffect(() => {
    const cachedFeatured = getCached<Event[]>(FEATURED_PARAMS);
    const cachedUpcoming = getCached<Event[]>(UPCOMING_PARAMS);
    if (cachedFeatured) setFeatured(cachedFeatured);
    if (cachedUpcoming) setUpcoming(cachedUpcoming);
    if (cachedFeatured && cachedUpcoming) setLoading(false);

    Promise.all([
      eventsApi.getAll(FEATURED_PARAMS),
      eventsApi.getAll(UPCOMING_PARAMS),
    ])
      .then(([featuredRes, upcomingRes]) => {
        const f = featuredRes.data.data;
        const u = upcomingRes.data.data;
        setFeatured(f);
        setUpcoming(u);
        setCached(FEATURED_PARAMS, f);
        setCached(UPCOMING_PARAMS, u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showSkeletons = loading && featured.length === 0;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {showSkeletons
            ? Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)
            : featured.map((event) => <FeaturedEventCard key={event.id} event={event} />)
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
      <UpcomingEventsCarousel events={upcoming} loading={loading && upcoming.length === 0} />
      <OrganizerCTA />
    </div>
  );
}
