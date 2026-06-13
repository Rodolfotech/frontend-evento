import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api';
import { HeroSearch } from '../features/events/HeroSearch';
import { FeaturedEventCard } from '../features/events/FeaturedEventCard';
import { CategoryGrid } from '../features/events/CategoryGrid';
import { ComunaGrid } from '../features/events/ComunaGrid';
import { UpcomingEventsCarousel } from '../features/events/UpcomingEventsCarousel';
import { OrganizerCTA } from '../features/events/OrganizerCTA';
import type { Event } from '../types';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    eventsApi.getAll({ limit: 8, dateFrom: today }).then(({ data: { data } }) => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FFFFFF' }}>
      <HeroSearch />

      {/* Eventos destacados */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            Eventos destacados
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#1D1D1F99' }}>
            Experiencias únicas que no te puedes perder
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
            className="text-sm font-medium hover:underline"
            style={{ color: '#2563EB' }}
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
