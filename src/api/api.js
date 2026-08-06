import { HTTPError, TimeoutError } from 'ky';
import { apiClient } from '@/api/client';
import { getCsrfToken } from '@/api/csrf';

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

const CSRF_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function request(
  path,
  options,
  { suppressUnauthorizedEvent = false } = {},
) {
  const normalizedPath = typeof path === 'string' ? path.replace(/^\/+/, '') : path;
  const method = (options?.method || 'GET').toUpperCase();
  let requestOptions = options;

  if (CSRF_METHODS.has(method)) {
    const token = await getCsrfToken();
    const headers = new Headers(options?.headers);
    headers.set('X-XSRF-TOKEN', token);
    requestOptions = { ...options, headers };
  }

  try {
    const response = await apiClient(normalizedPath, requestOptions);

    if (response.status === 204) {
      return;
    }

    const apiResponse = await response.json();

    if (apiResponse?.success === false) {
      throw new ApiError({
        code: apiResponse.code,
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
        && normalizedPath !== 'login'
        && !suppressUnauthorizedEvent
      ) {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }

      throw new ApiError({
        code: apiError?.code,
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
