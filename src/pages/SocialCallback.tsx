import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { socialApi } from '../api';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'instagram-connected', error: true }, window.location.origin);
        window.close();
      }
      return;
    }

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
  }, [searchParams]);

  return null;
}
