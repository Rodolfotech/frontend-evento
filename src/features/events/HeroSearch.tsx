import { useNavigate } from 'react-router-dom';
import { EventSearchForm, type EventSearchParams } from '../../components/ui/EventSearchForm';

export function HeroSearch() {
  const navigate = useNavigate();

  const handleSearch = (params: EventSearchParams) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.fecha) qs.set('fecha', params.fecha);
    if (params.categoriaId) qs.set('categoriaId', params.categoriaId);
    if (params.ciudad) qs.set('ciudad', params.ciudad);
    if (params.gratis) qs.set('gratis', 'true');
    if (params.dateFrom) qs.set('dateFrom', params.dateFrom);
    if (params.dateTo) qs.set('dateTo', params.dateTo);
    navigate(`/categorias?${qs.toString()}`);
  };

  return (
    <section className="px-4 py-6 bg-white">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden min-h-105 flex items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/home/home_eventos.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative w-full max-w-5xl mx-auto px-8 py-14 text-center">
          <h1
            className="text-4xl md:text-6xl font-semibold text-white mb-3 drop-shadow"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Descubre La Araucanía
          </h1>
          <p className="text-base md:text-lg text-white/80 mb-10">
            Explora eventos únicos, naturaleza y cultura en el corazón del sur de Chile
          </p>

          <EventSearchForm onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
}
