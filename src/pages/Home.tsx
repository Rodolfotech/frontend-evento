import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi, categoriesApi } from '../api';
import EventCard from '../components/EventCard';
import type { Event, Category } from '../types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Music,
  Mountain,
  Palette,
  UtensilsCrossed,
  Trophy,
  ArrowRight,
  Search,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Music> = {
  Música: Music,
  Turismo: Mountain,
  Arte: Palette,
  Gastronomía: UtensilsCrossed,
  Deportes: Trophy,
};

const categoryGradients: Record<string, string> = {
  Música: 'from-violet-600/20 to-purple-600/20 border-violet-500/30',
  Turismo: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30',
  Arte: 'from-pink-600/20 to-rose-600/20 border-pink-500/30',
  Gastronomía: 'from-orange-600/20 to-amber-600/20 border-orange-500/30',
  Deportes: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30',
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventsApi.getAll().then(({ data }) => setEvents(data));
    categoriesApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  const featured = events[0];

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
              Encuentra conciertos, experiencias turísticas y más.
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

          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass text-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {filteredCategories.map((cat) => {
              const Icon = categoryIcons[cat.name] || MapPin;
              const grad = categoryGradients[cat.name] || 'from-gray-600/20 to-slate-600/20 border-gray-500/30';
              return (
                <Link
                  key={cat.id}
                  to={`/events?category=${cat.id}`}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${grad} border transition-all hover:scale-105 hover:glow-purple`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {featured && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            Destacado
          </h2>
          <EventCard event={featured} featured />
        </section>
      )}

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
          {events.slice(1, 18).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
