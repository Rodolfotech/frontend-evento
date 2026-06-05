import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogIn, Mail } from 'lucide-react';
import { authApi } from '../api';
import { GlassCard } from '../components/ui/GlassCard';
import { FormInput } from '../components/ui/FormInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { GradientButton } from '../components/ui/GradientButton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { GoogleOAuthButton } from '../features/auth/GoogleOAuthButton';
import { AuthHeader } from '../features/auth/AuthHeader';
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
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        <GlassCard glow="purple">
          <AuthHeader title="Bienvenido de vuelta" subtitle="Ingresa a tu cuenta" />
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
              icon={Mail}
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <GradientButton type="submit" disabled={loading} loading={loading} loadingText="Ingresando..." icon={LogIn}>
              Ingresar
            </GradientButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/forgot-password" className="text-neon-cyan hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-neon-cyan hover:underline">
              Registrarse
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
