import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Sparkles, ArrowLeft, Mail, Send } from 'lucide-react';

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
      // Silently fail - don't reveal if email exists
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
          <div className="glass rounded-2xl p-8 glow-purple text-center">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        <div className="glass rounded-2xl p-8 glow-purple">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Recuperar Contraseña</h1>
            <p className="text-gray-400 text-sm mt-1">Te enviaremos un enlace a tu correo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neon-cyan" />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-neon-cyan hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Volver a inicio de sesión
            </Link>
          </p>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400">
              ⚡ Modo desarrollo: los correos se capturan en{' '}
              <a href="https://ethereal.email/login" target="_blank" rel="noopener noreferrer" className="underline">
                Ethereal
              </a>. Revisa la terminal del backend para ver las credenciales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
