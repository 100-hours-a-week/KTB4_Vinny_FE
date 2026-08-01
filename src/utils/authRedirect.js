const LOGIN_REDIRECT_PATH_KEY = 'auth:loginRedirectPath';

export function saveLoginRedirectPath(redirectPath) {
  try {
    sessionStorage.setItem(LOGIN_REDIRECT_PATH_KEY, redirectPath);
  } catch {
    // 로그인 자체는 브라우저 저장소 사용 가능 여부와 관계없이 진행
  }
}

export function getAndClearLoginRedirectPath(fallback = '/') {
  let redirectPath;

  try {
    redirectPath = sessionStorage.getItem(LOGIN_REDIRECT_PATH_KEY);
    sessionStorage.removeItem(LOGIN_REDIRECT_PATH_KEY);
  } catch {
    return fallback;
  }

  if (!redirectPath?.startsWith('/') || redirectPath.startsWith('//')) {
    return fallback;
  }

  return redirectPath;
}
