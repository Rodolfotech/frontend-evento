import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AuthHeader } from '../components/auth/AuthHeader';
import { FormInput } from '../components/ui/FormInput';
import { GradientButton } from '../components/ui/GradientButton';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md mx-4">
          <GlassCard glow="purple" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Revisa tu bandeja de entrada</h1>
            <p className="text-sm text-gray-400 mb-6">
              Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Link to="/login" className="text-neon-cyan hover:underline text-sm inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Volver a inicio de sesión
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        <GlassCard glow="purple">
          <AuthHeader title="Recuperar Contraseña" subtitle="Te enviaremos un enlace a tu correo" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <GradientButton type="submit" disabled={loading || !email} loading={loading} loadingText="Enviando..." icon={Send}>
              Enviar enlace
            </GradientButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-neon-cyan hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Volver a inicio de sesión
            </Link>
          </p>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400">
              Modo desarrollo: los correos se capturan en{' '}
              <a href="https://ethereal.email/login" target="_blank" rel="noopener noreferrer" className="underline">
                Ethereal
              </a>. Revisa la terminal del backend para ver las credenciales.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
