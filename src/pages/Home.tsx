import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api';
import EventCard from '../features/events/EventCard';
import type { Event } from '../types';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Search,
  MapPin,
  MapPinned,
} from 'lucide-react';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventsApi.getAll().then(({ data: { data } }) => setEvents(data));
  }, []);

  const filteredEvents = search
    ? events.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
      )
    : events;

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-cyan mb-6">
              <Sparkles className="w-4 h-4" />
              Descubre experiencias únicas
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Crea tu panorama</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Encuentra eventos de la comunidad como conciertos, experiencias turísticas y más.
              Conecta con tus redes sociales y comparte cada momento.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/events"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Calendar className="w-5 h-5" />
                Explorar Eventos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-gray-300 font-medium hover:text-white transition-all"
              >
                Publica tu Evento
              </Link>
            </div>
          </div>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass text-sm"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPinned className="w-6 h-6 text-neon-cyan" />
            Explora por comuna
          </h2>
          <Link
            to="/events"
            className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Comunas de La Araucanía">
          {['Temuco', 'Pucón', 'Villarrica', 'Lautaro', 'Angol', 'Padre Las Casas', 'Nueva Imperial', 'Victoria'].map((comuna) => (
            <Link
              key={comuna}
              to={`/events?comuna=${encodeURIComponent(comuna)}`}
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
            to="/events"
            className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredEvents.slice(0, 18).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
