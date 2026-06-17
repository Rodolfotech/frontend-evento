import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_ROUTE } from '../../constants/admin';
import {
  LogIn,
  User,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Eventos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/comunas', label: 'Comunas' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/Logohoysesale.svg" alt="HoySeSale" className="h-10 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  location.pathname === to
                    ? 'text-[#2563EB]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-event"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  Publicar evento
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ADMIN_ROUTE}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === ADMIN_ROUTE
                        ? 'text-[#2563EB]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80"
                  style={{ color: '#2563EB', border: '1px solid #2563EB' }}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
                  style={{ color: '#2563EB' }}
                >
                  <User className="w-4 h-4" />
                  hoysesale.cl
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={{ borderColor: '#2563EB', color: '#2563EB' }}
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === to
                    ? 'text-[#2563EB] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <hr className="border-gray-100 my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-event"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  Publicar evento
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ADMIN_ROUTE}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600"
                  >
                    <Shield className="w-4 h-4" />
                    Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600"
                >
                  <User className="w-4 h-4" />
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full cursor-pointer"
                  style={{ color: '#1D1D1F' }}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium border"
                  style={{ borderColor: '#2563EB', color: '#2563EB' }}
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white text-center"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
