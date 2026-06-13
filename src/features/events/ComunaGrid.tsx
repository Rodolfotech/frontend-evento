import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../../api';
import { COMUNAS } from '../../constants/comunas';
import { Pagination } from '../../components/ui/Pagination';
import type { Event } from '../../types';

const PER_PAGE = 8;

const PRIORITY_COMUNAS = [
  'Temuco',
  'Villarrica',
  'Pucón',
  'Nueva Imperial',
  'Puerto Saavedra',
  'Angol',
  'Traiguén',
  'Carahue',
];

const COMUNA_IMAGE: Record<string, string> = {
  'Temuco':          '/comunas/temuco.jpg',
  'Villarrica':      '/comunas/villarrica.jpg',
  'Pucón':           '/comunas/pucon.jpg',
  'Nueva Imperial':  '/comunas/nueva-imperial.jpg',
  'Puerto Saavedra': '/comunas/puerto-saavedra.jpg',
  'Angol':           '/comunas/angol.jpg',
  'Traiguén':        '/comunas/traiguen.jpg',
  'Carahue':         '/comunas/carahue.jpg',
};

const FALLBACK_COLORS = ['#1D3461','#0F766E','#15803D','#7C3AED','#0369A1','#BE185D','#374151','#0891B2'];

function getFallbackColor(name: string): string {
  return FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length];
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
  const sectionRef = useRef<HTMLElement>(null);
  const [comunas, setComunas] = useState<ComunaData[]>([]);
  const [page, setPage] = useState(1);

  function handlePageChange(newPage: number) {
    setPage(newPage);
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        window.scrollTo({ top: sectionRef.current.offsetTop - 72, behavior: 'smooth' });
      }
    });
  }

  useEffect(() => {
    eventsApi.getAll({ limit: 500 })
      .then(({ data: { data } }) => {
        const counts: Record<string, number> = {};
        (data as Event[]).forEach((e) => {
          if (e.city) counts[e.city] = (counts[e.city] || 0) + 1;
        });
        const priority = PRIORITY_COMUNAS.map((name) => ({ name, count: counts[name] || 0 }));
        const rest = COMUNAS
          .filter((name) => !PRIORITY_COMUNAS.includes(name))
          .map((name) => ({ name, count: counts[name] || 0 }))
          .sort((a, b) => b.count - a.count);
        setComunas([...priority, ...rest]);
      })
      .catch(() => {
        const priority = PRIORITY_COMUNAS.map((name) => ({ name, count: 0 }));
        const rest = COMUNAS
          .filter((name) => !PRIORITY_COMUNAS.includes(name))
          .map((name) => ({ name, count: 0 }));
        setComunas([...priority, ...rest]);
      });
  }, []);

  const totalPages = Math.ceil(comunas.length / PER_PAGE);
  const visible = comunas.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section ref={sectionRef} className="w-full py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>{title}</h2>
          <p className="mt-2 text-base font-medium max-w-xl mx-auto" style={{ color: '#1D1D1F', fontFamily: "'Raleway', sans-serif" }}>{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => navigate(`/categorias?ciudad=${encodeURIComponent(name)}`)}
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* Capa 1: color fallback (fondo base) */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: getFallbackColor(name) }}
              />

              {/* Capa 2: foto — define el alto natural de la card */}
              {COMUNA_IMAGE[name] ? (
                <img
                  src={COMUNA_IMAGE[name]}
                  alt={name}
                  className="relative block w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full" style={{ height: '200px' }} />
              )}

              {/* Capa 3: overlay oscuro para legibilidad del texto */}
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors" />

              {/* Capa 4: texto */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <p className="text-white font-semibold text-lg leading-tight" style={{ fontFamily: 'var(--font-brand)' }}>{name}</p>
                <p className="text-white/80 text-sm mt-0.5" style={{ fontFamily: 'var(--font-brand)' }}>{count} Evento{count !== 1 ? 's' : ''}</p>
              </div>
            </button>
          ))}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </section>
  );
}
