import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socialApi } from '../api';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('error');
      setTimeout(() => navigate('/profile'), 2000);
      return;
    }

    socialApi
      .instagramCallback(code)
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/profile'), 1500);
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => navigate('/profile'), 2000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center max-w-sm mx-4">
        {status === 'processing' && (
          <>
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Conectando Instagram...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">✓</div>
            <p className="text-emerald-400 font-medium">Instagram conectado</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">✗</div>
            <p className="text-red-400 font-medium">Error al conectar Instagram</p>
          </>
        )}
      </div>
    </div>
  );
}
