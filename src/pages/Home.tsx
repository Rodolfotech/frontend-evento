import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api';
import { HeroSearch } from '../features/events/HeroSearch';
import { FeaturedEventCard } from '../features/events/FeaturedEventCard';
import type { Event } from '../types';
import { ArrowRight, ChevronRight, MapPin, MapPinned } from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    eventsApi.getAll({ limit: 8, dateFrom: today }).then(({ data: { data } }) => setEvents(data));
  }, []);

  function scrollRight() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FFFFFF' }}>
      <HeroSearch />



      {/* Eventos destacados */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Encabezado centrado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            Eventos destacados
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#1D1D1F99' }}>
            Experiencias únicas que no te puedes perder
          </p>
        </div>

        {/* Carrusel */}
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

          {/* Flecha siguiente */}
          {events.length > 4 && (
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Ver más eventos"
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors hover:opacity-90"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#2563EB' }} />
            </button>
          )}
        </div>

        {/* Ver todos */}
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





      {/* Comunas */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: '#1D1D1F' }}>
            <MapPinned className="w-6 h-6" style={{ color: '#2563EB' }} />
            Explora por comuna
          </h2>
          <Link
            to="/comunas"
            className="text-sm font-medium flex items-center gap-1 hover:underline"
            style={{ color: '#2563EB' }}
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Comunas de La Araucanía">
          {['Temuco', 'Pucón', 'Villarrica', 'Lautaro', 'Angol', 'Padre Las Casas', 'Nueva Imperial', 'Victoria'].map((comuna) => (
            <Link
              key={comuna}
              to={`/categorias?ciudad=${encodeURIComponent(comuna)}`}
              role="listitem"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all"
              style={{ borderColor: '#E4EBFA', color: '#1D1D1F99' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E4EBFA'; e.currentTarget.style.color = '#1D1D1F99'; }}
            >
              <MapPin className="w-3 h-3" style={{ color: '#2563EB' }} />
              {comuna}
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
}
