import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedEventCard } from './FeaturedEventCard';
import { EventCardSkeleton } from '../../components/ui/EventCardSkeleton';
import type { Event } from '../../types';

const PAGE_SIZE = 4;

interface Props {
  events: Event[];
  loading: boolean;
  title: string;
  subtitle: string;
}

export function EventsCarouselGrid({ events, loading, title, subtitle }: Props) {
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [events]);

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;
  const visible = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const showSkeletons = loading && events.length === 0;

  return (
    <div>
      {/* Encabezado con flechas */}
      <div className="flex items-end justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            {title}
          </h2>
          <p className="mt-2 text-base font-medium" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>
            {subtitle}
          </p>
        </div>

        {/* Flechas — solo visibles si hay más de 4 eventos */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPage(p => p - 1)}
              disabled={!hasPrev}
              aria-label="Página anterior"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-default"
              style={{
                backgroundColor: hasPrev ? '#1D1D1F' : '#E4EBFA',
                color: hasPrev ? '#FFFFFF' : '#1D1D1F33',
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              aria-label="Página siguiente"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-default"
              style={{
                backgroundColor: hasNext ? '#1D1D1F' : '#E4EBFA',
                color: hasNext ? '#FFFFFF' : '#1D1D1F33',
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {showSkeletons
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)
          : visible.map(event => <FeaturedEventCard key={event.id} event={event} />)
        }
      </div>
    </div>
  );
}
