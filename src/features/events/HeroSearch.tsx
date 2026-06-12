import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronDown } from 'lucide-react';
import { categoriesApi } from '../../api';
import { COMUNAS } from '../../constants/comunas';
import type { Category } from '../../types';
import { format, addDays, nextSaturday, nextSunday, isSaturday, isSunday } from 'date-fns';

function getWeekendRange(): { from: string; to: string } {
  const today = new Date();
  const sat = isSaturday(today) ? today : nextSaturday(today);
  const sun = isSunday(today) ? today : nextSunday(addDays(sat, 0));
  return {
    from: format(sat, 'yyyy-MM-dd'),
    to: format(sun, 'yyyy-MM-dd'),
  };
}

export function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeQuick, setActiveQuick] = useState<'gratis' | 'hoy' | 'findesemana' | null>(null);

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const buildParams = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (fecha) params.set('fecha', fecha);
    if (categoriaId) params.set('categoriaId', categoriaId);
    if (ciudad) params.set('ciudad', ciudad);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return params.toString();
  };

  const handleSearch = () => {
    setActiveQuick(null);
    navigate(`/categorias?${buildParams()}`);
  };

  const handleQuick = (type: 'gratis' | 'hoy' | 'findesemana') => {
    setActiveQuick(type);
    if (type === 'gratis') {
      navigate(`/categorias?gratis=true`);
    } else if (type === 'hoy') {
      const today = format(new Date(), 'yyyy-MM-dd');
      navigate(`/categorias?fecha=${today}`);
    } else {
      const { from, to } = getWeekendRange();
      navigate(`/categorias?dateFrom=${from}&dateTo=${to}`);
    }
  };

  return (
    <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/home/home_eventos.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative w-full max-w-5xl mx-auto px-4 py-16 text-center">
        <h1
          className="text-4xl md:text-6xl font-semibold text-white mb-3 drop-shadow"
          style={{ fontFamily: 'var(--font-brand)' }}
        >
          Descubre La Araucanía
        </h1>
        <p className="text-base md:text-lg text-white/80 mb-10">
          Explora eventos únicos, naturaleza y cultura en el corazón del sur de Chile
        </p>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-left">
          {/* Inputs row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 mb-4">
            {/* Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Buscar evento
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="¿Qué buscas?"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 appearance-none focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Comuna */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Comuna
              </label>
              <div className="relative">
                <select
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 appearance-none focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="">Todas las comunas</option>
                  {COMUNAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Buscar button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: '#2563EB' }}
              >
                Buscar →
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleQuick('gratis')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeQuick === 'gratis'
                  ? 'text-white border-[#2563EB]'
                  : 'text-gray-600 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
              style={activeQuick === 'gratis' ? { backgroundColor: '#2563EB' } : {}}
            >
              Gratis
            </button>
            <button
              type="button"
              onClick={() => handleQuick('hoy')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeQuick === 'hoy'
                  ? 'text-white border-[#2563EB]'
                  : 'text-gray-600 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
              style={activeQuick === 'hoy' ? { backgroundColor: '#2563EB' } : {}}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => handleQuick('findesemana')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeQuick === 'findesemana'
                  ? 'text-white border-[#2563EB]'
                  : 'text-gray-600 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
              style={activeQuick === 'findesemana' ? { backgroundColor: '#2563EB' } : {}}
            >
              Este Fin de Semana
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
