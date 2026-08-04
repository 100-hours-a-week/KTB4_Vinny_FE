import { apiClient } from '@/api/client';

let csrfPromise;

const CSRF_COOKIE_NAME = 'CINEON-XSRF-TOKEN';

function readCsrfCookie() {
  const cookiePrefix = `${encodeURIComponent(CSRF_COOKIE_NAME)}=`;
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(cookiePrefix));

  return cookie
    ? decodeURIComponent(cookie.slice(cookiePrefix.length))
    : undefined;
}

async function requestCsrfToken() {
  if (csrfPromise) {
    return csrfPromise;
  }

  csrfPromise = apiClient('csrf')
    .then(() => {
      const token = readCsrfCookie();

      if (!token) {
        throw new Error('CSRF 쿠키를 발급받지 못했습니다.');
      }

      return token;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

export async function getCsrfToken() {
  return readCsrfCookie() || requestCsrfToken();
}

export async function refreshCsrfToken() {
  return requestCsrfToken();
}
