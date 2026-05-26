import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, User } from 'lucide-react';
import { authApi } from '../api';
import { GlassCard } from '../components/ui/GlassCard';
import { FormInput } from '../components/ui/FormInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { GradientButton } from '../components/ui/GradientButton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { GoogleOAuthButton } from '../components/auth/GoogleOAuthButton';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthDivider } from '../components/auth/AuthDivider';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register } = useAuth();

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'google-code') {
        if (e.data.error) {
          setGoogleLoading(false);
          setError('Error al registrarse con Google');
          return;
        }
        if (e.data.code) {
          try {
            const { data } = await authApi.googleLogin(e.data.code);
            localStorage.setItem('token', data.access_token);
            window.location.href = '/profile';
          } catch {
            setGoogleLoading(false);
            setError('Error al registrarse con Google');
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
      await register(name, email, password);
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-neon-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-purple/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        <GlassCard glow="pink">
          <AuthHeader title="Crear Cuenta" subtitle="Únete a la comunidad" />
          <ErrorBanner message={error} />
          <GoogleOAuthButton
            loading={googleLoading}
            onLoadingChange={setGoogleLoading}
            onError={setError}
            label="Registrarse con Google"
            windowName="google-register"
          />
          <AuthDivider />
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              icon={User}
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
            <FormInput
              icon={Mail}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <PasswordInput
              icon={Mail}
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <GradientButton type="submit" disabled={loading} loading={loading} loadingText="Registrando..." gradient="purple-pink" icon={UserPlus}>
              Crear Cuenta
            </GradientButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-neon-cyan hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
