import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventsApi } from '../api';
import EventCard from '../features/events/EventCard';
import type { Event } from '../types';
import { COMUNAS } from '../constants/comunas';
import { Calendar, Search, MapPin, ChevronLeft, ChevronRight, MapPinned } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ITEMS_PER_PAGE = 12;

function groupByMonth(events: Event[]) {
  const groups: Record<string, Event[]> = {};
  for (const event of events) {
    const key = format(new Date(event.date), 'yyyy-MM');
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

function Pagination({ page, totalPages, onPageChange }: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Paginación de eventos" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">1</button>
          {start > 2 && <span className="text-gray-600 text-sm">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-label={`Página ${p}`}
          aria-current={p === page ? 'page' : undefined}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            p === page
              ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-600 text-sm">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedComuna, setSelectedComuna] = useState(searchParams.get('comuna') || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const defaultDateFrom = useMemo(() => {
    if (dateFrom || dateTo) return '';
    const now = new Date();
    return format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
  }, [dateFrom, dateTo]);

  const defaultDateTo = useMemo(() => {
    if (dateFrom || dateTo) return '';
    const now = new Date();
    return format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
  }, [dateFrom, dateTo]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: ITEMS_PER_PAGE };
    if (dateFrom) params.dateFrom = dateFrom;
    else if (defaultDateFrom) params.dateFrom = defaultDateFrom;
    if (dateTo) params.dateTo = dateTo;
    else if (defaultDateTo) params.dateTo = defaultDateTo;
    if (selectedCategory) params.categoryId = selectedCategory;
    if (selectedComuna) params.city = selectedComuna;
    eventsApi.getAll(params).then(({ data: { data, total } }) => {
      setEvents(data);
      setTotal(total);
      setLoading(false);
    });
  }, [page, dateFrom, dateTo, defaultDateFrom, defaultDateTo, selectedCategory, selectedComuna]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedComuna) {
      params.set('comuna', selectedComuna);
    } else {
      params.delete('comuna');
    }
    setSearchParams(params, { replace: true });
  }, [selectedComuna]);

  const filtered = useMemo(() => {
    if (!search) return events;
    return events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const months = useMemo(() => groupByMonth(filtered), [filtered]);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleComunaChange = (comuna: string) => {
    setSelectedComuna(comuna);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedComuna('');
    setDateFrom('');
    setDateTo('');
    setSelectedCategory('');
    setSearch('');
    setPage(1);
  };

  const hasFilters = selectedComuna || dateFrom || dateTo || selectedCategory;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {selectedComuna || 'Región de La Araucanía'}
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-1.5">
                <MapPinned className="w-4 h-4 text-neon-cyan" />
                {loading
                  ? 'Cargando...'
                  : selectedComuna
                    ? `${total} evento${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
                    : `${total} evento${total !== 1 ? 's' : ''} este mes`
                }
              </p>
            </div>
          </div>

          {/* Search + Comuna */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md" role="search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar eventos por título o descripción"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div className="relative sm:w-64">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={selectedComuna}
                onChange={(e) => handleComunaChange(e.target.value)}
                aria-label="Filtrar por comuna"
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm appearance-none bg-white cursor-pointer"
              >
                <option value="">Todas las comunas</option>
                {COMUNAS.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none rotate-90" />
            </div>
          </div>

          {/* Advanced filters */}
          <details className="mb-8 group">
            <summary className="text-sm text-gray-400 hover:text-white cursor-pointer list-none flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center group-open:bg-neon-cyan/20 group-open:border-neon-cyan transition-colors">
                <span className="w-2 h-0.5 bg-gray-400 group-open:rotate-90 group-open:bg-neon-cyan transition-all" />
              </span>
              Filtros avanzados
              {hasFilters && <span className="w-2 h-2 rounded-full bg-neon-cyan" />}
            </summary>
            <div className="glass rounded-2xl p-6 mt-4 glow-cyan">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Filtros</h3>
                {hasFilters && (
                  <button onClick={clearFilters}
                    className="text-xs text-neon-cyan hover:underline cursor-pointer">
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="dateFrom" className="block text-xs text-gray-400 mb-1">Fecha desde</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input id="dateFrom" type="date" value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-xs text-gray-400 mb-1">Fecha hasta</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input id="dateTo" type="date" value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="comuna" className="block text-xs text-gray-400 mb-1">Comuna</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <select id="comuna" value={selectedComuna}
                      onChange={(e) => handleComunaChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-sm appearance-none cursor-pointer">
                      <option value="">Todas las comunas</option>
                      {COMUNAS.map((comuna) => (
                        <option key={comuna} value={comuna}>{comuna}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-white/10 rounded w-full mb-2" />
                  <div className="h-3 bg-white/10 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {selectedComuna
                  ? `No hay eventos publicados en ${selectedComuna} aún`
                  : 'No hay eventos publicados este mes'}
              </p>
              <button onClick={clearFilters}
                className="mt-4 text-sm text-neon-cyan hover:underline cursor-pointer">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              {months.map(([monthKey, monthEvents]) => {
                const [year, month] = monthKey.split('-');
                const date = new Date(Number(year), Number(month) - 1);
                const monthName = format(date, 'MMMM yyyy', { locale: es });
                return (
                  <section key={monthKey} className="mb-10" aria-labelledby={`month-${monthKey}`}>
                    <h2 id={`month-${monthKey}`} className="text-lg font-bold text-white mb-4 capitalize flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-neon-cyan" />
                      {monthName}
                      <span className="text-sm font-normal text-gray-500">({monthEvents.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {monthEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </section>
                );
              })}
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
