import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi, socialApi } from '../api';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'instagram-connected', error: true }, window.location.origin);
        window.close();
      }
      return;
    }

    if (state === 'login') {
      authApi
        .instagramLogin(code)
        .then(({ data }) => {
          if (window.opener) {
            window.opener.postMessage(
              { type: 'instagram-login', token: data.access_token, user: data.user },
              window.location.origin,
            );
            window.close();
          }
        })
        .catch(() => {
          if (window.opener) {
            window.opener.postMessage({ type: 'instagram-login', error: true }, window.location.origin);
            window.close();
          }
        });
    } else {
      socialApi
        .instagramCallback(code)
        .then(() => {
          if (window.opener) {
            window.opener.postMessage({ type: 'instagram-connected', success: true }, window.location.origin);
            window.close();
          }
        })
        .catch(() => {
          if (window.opener) {
            window.opener.postMessage({ type: 'instagram-connected', error: true }, window.location.origin);
            window.close();
          }
        });
    }
  }, [searchParams]);

  return null;
}
