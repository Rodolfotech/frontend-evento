import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api';
import EventCard from '../features/events/EventCard';
import { HeroSearch } from '../features/events/HeroSearch';
import type { Event } from '../types';
import { ArrowRight, MapPin, MapPinned } from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventsApi.getAll({ limit: 8 }).then(({ data: { data } }) => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen pt-16">
      <HeroSearch />

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

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            Próximos Eventos
          </h2>
          <Link
            to="/categorias"
            className="text-sm font-medium flex items-center gap-1 hover:underline"
            style={{ color: '#2563EB' }}
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
