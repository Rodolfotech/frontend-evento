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
    <div className="bg-white">
      {/* Hero image — full width, sin margin top */}
      <div className="relative w-full overflow-hidden" style={{ height: '400px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/home/home_eventos.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/55" />

        {/* Título y subtítulo centrados en la parte superior de la imagen */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-10 text-center px-4">
          <h1
            className="text-4xl md:text-6xl font-semibold text-white mb-3 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Descubre La Araucanía
          </h1>
          <p className="text-base md:text-lg text-white/85">
            Explora eventos únicos, naturaleza y cultura en el corazón del sur de Chile
          </p>
        </div>
      </div>

      {/* Card que sobresale de la imagen hacia abajo */}
      <div className="max-w-5xl mx-auto px-4 -mt-14 relative z-20 pb-6">
        <EventSearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
}
