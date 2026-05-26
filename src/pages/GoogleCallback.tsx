import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!window.opener) return;

    if (!code) {
      window.opener.postMessage({ type: 'google-code', error: true }, '*');
      window.close();
      return;
    }

    window.opener.postMessage({ type: 'google-code', code }, '*');
    window.close();
  }, [searchParams]);

  return null;
}
