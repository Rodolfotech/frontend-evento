import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../api';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'google-login', error: true }, '*');
        window.close();
      }
      return;
    }

    authApi
      .googleLogin(code)
      .then(({ data }) => {
        if (window.opener) {
          window.opener.postMessage(
            { type: 'google-login', token: data.access_token, user: data.user },
            '*',
          );
          window.close();
        }
      })
      .catch(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'google-login', error: true }, '*');
          window.close();
        }
      });
  }, [searchParams]);

  return null;
}
