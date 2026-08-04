import ky, { HTTPError, TimeoutError } from 'ky';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export class ApiError extends Error {
  constructor({
    code,
    message = '요청에 실패했습니다.',
    status,
  } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export function createAuthorizationHeaders(accessToken) {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
}

const api = ky.create({
  prefix: API_BASE_URL,
  timeout: 5000,
});

function hasAuthorizationHeader(headers) {
  if (!headers) {
    return false;
  }

  return new Headers(headers).has('Authorization');
}

export async function request(
  path,
  options,
  { suppressUnauthorizedEvent = false } = {},
) {
  if (!API_BASE_URL) {
    throw new Error('API 주소가 설정되지 않았습니다.');
  }

  const normalizedPath = typeof path === 'string' ? path.replace(/^\/+/, '') : path;

  try {
    const response = await api(normalizedPath, options);

    if (response.status === 204) {
      return;
    }

    const apiResponse = await response.json();

    if (apiResponse?.success === false) {
      throw new ApiError({
        code: apiResponse.code ?? apiResponse.message,
        message: apiResponse.message,
        status: response.status,
      });
    }

    return apiResponse?.data;
  } catch (error) {
    if (error instanceof HTTPError) {
      const apiError = (
        error.data
        && typeof error.data === 'object'
      ) ? error.data : null;

      if (
        error.response.status === 401
        && hasAuthorizationHeader(options?.headers)
        && !suppressUnauthorizedEvent
      ) {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }

      throw new ApiError({
        code: apiError?.code ?? apiError?.message,
        message: apiError?.message,
        status: error.response.status,
      });
    }

    if (error instanceof TimeoutError) {
      throw new Error('요청 시간이 초과되었습니다.');
    }

    throw error;
  }
}
