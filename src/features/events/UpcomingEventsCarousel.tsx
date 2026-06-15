import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../../api';
import { getCached, setCached } from '../../api/eventsCache';
import { FeaturedEventCard } from './FeaturedEventCard';
import { EventCardSkeleton } from '../../components/ui/EventCardSkeleton';
import type { Event } from '../../types';

const UPCOMING_PARAMS = { limit: 8 };

interface Props {
  title?: string;
  subtitle?: string;
  events?: Event[];
  loading?: boolean;
}

export function UpcomingEventsCarousel({
  title = 'Próximos eventos',
  subtitle = 'Experiencias únicas que no te puedes perder',
  events: eventsProp,
  loading: loadingProp,
}: Props) {
  const selfFetch = eventsProp === undefined;
  const [events, setEvents] = useState<Event[]>(() =>
    selfFetch ? (getCached<Event[]>(UPCOMING_PARAMS) ?? []) : eventsProp
  );
  const [loading, setLoading] = useState(selfFetch ? events.length === 0 : (loadingProp ?? false));

  useEffect(() => {
    if (!selfFetch) {
      setEvents(eventsProp);
      setLoading(loadingProp ?? false);
      return;
    }
    const cached = getCached<Event[]>(UPCOMING_PARAMS);
    if (cached) { setEvents(cached); setLoading(false); }

    eventsApi.getAll(UPCOMING_PARAMS)
      .then(({ data: { data } }) => { setEvents(data); setCached(UPCOMING_PARAMS, data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selfFetch, eventsProp, loadingProp]);

  const showSkeletons = loading && events.length === 0;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
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
      </div>
    </section>
  );
}
