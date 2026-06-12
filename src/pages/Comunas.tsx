import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { COMUNAS } from '../constants/comunas';

export default function Comunas() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Comunas</h1>
          <p className="text-gray-400">Explora eventos por comuna en La Araucanía</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {COMUNAS.map((comuna) => (
            <Link
              key={comuna}
              to={`/categorias?comuna=${encodeURIComponent(comuna)}`}
              className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl glass text-sm text-gray-300 hover:text-white hover:border-neon-cyan/30 transition-all group"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neon-cyan shrink-0" />
                {comuna}
              </span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
