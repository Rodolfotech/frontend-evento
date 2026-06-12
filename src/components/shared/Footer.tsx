import { Link } from 'react-router-dom';
import { Shield, FileText, Trash2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Isotipo.svg" alt="HoySesale.cl" className="h-10 w-auto" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-brand)', color: '#2563EB' }}>HoySeSale</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/privacidad"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-cyan transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Privacidad
            </Link>
            <Link
              to="/terminosdelservicio"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-cyan transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Términos
            </Link>
            <Link
              to="/eliminacion-datos"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-cyan transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar datos
            </Link>
          </div>

          <p className="text-xs text-gray-600">© {new Date().getFullYear()} HoySesale.cl. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
