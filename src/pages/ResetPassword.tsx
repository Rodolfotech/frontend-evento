import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { Lock, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      localStorage.setItem('token', data.access_token);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm mx-4">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Enlace inválido</h1>
          <p className="text-sm text-gray-400 mb-4">El enlace de recuperación no es válido o ya expiró.</p>
          <Link to="/forgot-password" className="text-neon-cyan hover:underline text-sm">
            Solicitar un nuevo enlace
          </Link>
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
            <h1 className="text-2xl font-bold text-white">Nueva Contraseña</h1>
            <p className="text-gray-400 text-sm mt-1">Ingresa tu nueva contraseña</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-4 text-sm text-center">
              Contraseña restablecida. Redirigiendo...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neon-cyan" />
                    Nueva Contraseña
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 py-2.5 rounded-xl text-sm"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-neon-cyan hover:underline">
              Volver a inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
