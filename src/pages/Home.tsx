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
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPinned className="w-6 h-6 text-neon-cyan" />
            Explora por comuna
          </h2>
          <Link
            to="/comunas"
            className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-gray-300 hover:text-white hover:glow-purple transition-all"
            >
              <MapPin className="w-3 h-3 text-neon-cyan" />
              {comuna}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Próximos Eventos
          </h2>
          <Link
            to="/categorias"
            className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
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
