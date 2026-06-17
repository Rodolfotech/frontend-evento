import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn, Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../api';
import { FormInput } from '../components/ui/FormInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { GradientButton } from '../components/ui/GradientButton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { GoogleOAuthButton } from '../features/auth/GoogleOAuthButton';
import { AuthDivider } from '../features/auth/AuthDivider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'google-code') {
        if (e.data.error) {
          setGoogleLoading(false);
          setError('Error al iniciar sesión con Google');
          return;
        }
        if (e.data.code) {
          try {
            const { data } = await authApi.googleLogin(e.data.code);
            localStorage.setItem('token', data.access_token);
            window.location.href = '/profile';
          } catch {
            setGoogleLoading(false);
            setError('Error al iniciar sesión con Google');
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      window.location.href = '/profile';
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8FAFC' }}>

      {/* Panel izquierdo — branding */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 rounded-3xl m-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)' }}
      >
        <img
          src="/login/fondo_iniciar_sesion.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ mixBlendMode: 'overlay', opacity: 0.4 }}
        />
        <img src="/login/Logohoysesale-blanco.svg" alt="HoySeSale" className="h-10 w-auto self-start relative z-10" />
        <div className="relative z-10">
          <p style={{ fontSize: '40px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Raleway', system-ui, sans-serif", lineHeight: '1.15' }}>
            La Araucanía,<br />en un solo lugar
          </p>
          <p className="mt-4" style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', fontFamily: "'Raleway', system-ui, sans-serif", lineHeight: '1.6' }}>
            Descubre eventos, y vive experiencias únicas en la región.
          </p>
        </div>
        <p className="relative z-10" style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', fontFamily: "'Raleway', system-ui, sans-serif" }}>
          Hoysesale.cl
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Regresar */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:underline"
            style={{ color: '#1D1D1F99' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar al inicio de <span style={{ color: '#2563EB' }}>Hoysesale.cl</span>
          </Link>

          {/* Card */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4EBFA' }}>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                <img src="/Isotipo.svg" alt="" className="w-8 h-8" />
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
                Bienvenido de vuelta
              </p>
              <p className="mt-1" style={{ fontSize: '13px', color: '#1D1D1F99', fontFamily: "'Raleway', system-ui, sans-serif" }}>
                Ingresa a tu cuenta
              </p>
            </div>

            <ErrorBanner message={error} />

            <GoogleOAuthButton
              loading={googleLoading}
              onLoadingChange={setGoogleLoading}
              onError={setError}
            />

            <AuthDivider />

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                icon={Mail}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
              <PasswordInput
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <GradientButton type="submit" disabled={loading} loading={loading} loadingText="Ingresando..." icon={LogIn}>
                Ingresar
              </GradientButton>
            </form>

            <p className="text-center text-sm mt-4" style={{ color: '#1D1D1F99' }}>
              <Link to="/forgot-password" className="hover:underline font-medium" style={{ color: '#2563EB' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
            <p className="text-center text-sm mt-3" style={{ color: '#1D1D1F99' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{ color: '#2563EB' }}>
                Registrarse
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
