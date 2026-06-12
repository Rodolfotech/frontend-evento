import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_ROUTE } from '../../constants/admin';
import {
  Sparkles,
  Calendar,
  PlusCircle,
  LogIn,
  User,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Inicio', icon: Sparkles },
  { to: '/events', label: 'Eventos', icon: Calendar },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/Isotipo.svg" alt="HoySesale.cl" className="h-12 w-auto" />
            <span className="text-xl font-semibold tracking-tight text-white" style={{ fontFamily: 'var(--font-brand)' }}>
              HoySeSale
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-white/10 text-neon-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-event"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publicar Evento
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ADMIN_ROUTE}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === ADMIN_ROUTE
                        ? 'bg-white/10 text-neon-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === '/profile'
                      ? 'bg-white/10 text-neon-cyan'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {user?.name}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-neon-pink hover:bg-white/5 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  location.pathname === to
                    ? 'bg-white/10 text-neon-cyan'
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <hr className="border-white/5" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-event"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neon-cyan"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publicar Evento
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ADMIN_ROUTE}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neon-cyan"
                  >
                    <Shield className="w-4 h-4" />
                    Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400"
                >
                  <User className="w-4 h-4" />
                  {user?.name}
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neon-pink w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-neon-purple font-medium"
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
