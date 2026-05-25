import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { socialApi } from '../api';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg('Autorización cancelada o rechazada.');
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMsg('Código de autorización no recibido.');
      return;
    }

    socialApi
      .instagramCallback(code)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          if (window.opener) {
            window.opener.postMessage({ type: 'instagram-connected', success: true }, window.location.origin);
            window.close();
          }
        }, 1500);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err?.response?.data?.message || 'Error al conectar Instagram.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="w-10 h-10 border-2 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Conectando Instagram...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-green-400">Instagram conectado correctamente</p>
            <p className="text-gray-500 text-sm mt-2">Cerrando ventana...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <p className="text-red-400">{errorMsg}</p>
            <p className="text-gray-500 text-sm mt-2">Puedes cerrar esta ventana</p>
          </>
        )}
      </div>
    </div>
  );
}
