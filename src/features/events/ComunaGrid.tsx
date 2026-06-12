import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../../api';
import { COMUNAS } from '../../constants/comunas';
import { Pagination } from '../../components/ui/Pagination';
import type { Event } from '../../types';

const PER_PAGE = 8;

const FALLBACK_COLORS: Record<string, string> = {
  Temuco:           '#1D3461',
  Villarrica:       '#0F766E',
  'Pucón':          '#15803D',
  'Nueva Imperial': '#7C3AED',
  'Padre Las Casas':'#0369A1',
  Lautaro:          '#BE185D',
  Angol:            '#B45309',
  Carahue:          '#0891B2',
  'Traiguén':       '#374151',
  Victoria:         '#1D3461',
};

function getFallbackColor(name: string): string {
  if (FALLBACK_COLORS[name]) return FALLBACK_COLORS[name];
  const palette = ['#1D3461','#0F766E','#15803D','#7C3AED','#0369A1','#BE185D','#374151','#0891B2'];
  return palette[name.charCodeAt(0) % palette.length];
}

interface ComunaData {
  name: string;
  count: number;
}

interface Props {
  title?: string;
  subtitle?: string;
}

export function ComunaGrid({
  title = 'Descubre experiencias por comuna',
  subtitle = 'Explora eventos y experiencias en las distintas comunas de la región.',
}: Props) {
  const navigate = useNavigate();
  const [comunas, setComunas] = useState<ComunaData[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    eventsApi.getAll({ limit: 500 })
      .then(({ data: { data } }) => {
        const counts: Record<string, number> = {};
        (data as Event[]).forEach((e) => {
          if (e.city) counts[e.city] = (counts[e.city] || 0) + 1;
        });
        const list: ComunaData[] = COMUNAS.map((name) => ({
          name,
          count: counts[name] || 0,
        })).sort((a, b) => b.count - a.count);
        setComunas(list);
      })
      .catch(() => {
        setComunas(COMUNAS.map((name) => ({ name, count: 0 })));
      });
  }, []);

  const totalPages = Math.ceil(comunas.length / PER_PAGE);
  const visible = comunas.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="w-full py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: '#1D1D1F' }}>{title}</h2>
          <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: '#1D1D1F99' }}>{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => navigate(`/categorias?ciudad=${encodeURIComponent(name)}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ height: '200px' }}
            >
              {/* Imagen de fondo */}
              <img
                src={`/comunas/${name.toLowerCase().replace(/ /g, '-').replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i').replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/[ñ]/g,'n')}.jpg`}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />

              {/* Fondo de color fallback */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: getFallbackColor(name) }}
              />

              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

              {/* Texto */}
              <div className="absolute bottom-0 left-0 p-4 text-left">
                <p className="text-white font-semibold text-base leading-tight">{name}</p>
                <p className="text-white/80 text-sm mt-0.5">{count} Evento{count !== 1 ? 's' : ''}</p>
              </div>
            </button>
          ))}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
}
