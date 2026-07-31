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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/`
  : undefined;

const api = ky.create({
  baseUrl: API_BASE_URL,
  timeout: 5000,
});

function hasAuthorizationHeader(headers) {
  if (!headers) {
    return false;
  }

  return new Headers(headers).has('Authorization');
}

export async function request(path, options) {
  if (!API_BASE_URL) {
    throw new Error('API 주소가 설정되지 않았습니다.');
  }

  try {
    const response = await api(path, options);

    if (response.status === 204) {
      return;
    }

    const apiResponse = await response.json();

    if (apiResponse?.success === false) {
      throw new ApiError({
        code: apiResponse.message,
        status: response.status,
      });
    }

    return apiResponse?.data;
  } catch (error) {
    if (error instanceof HTTPError) {
      const apiError = await error.response.json().catch(() => null);

      if (
        error.response.status === 401
        && hasAuthorizationHeader(options?.headers)
      ) {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }

      throw new ApiError({
        code: apiError?.message,
        status: error.response.status,
      });
    }

    if (error instanceof TimeoutError) {
      throw new Error('요청 시간이 초과되었습니다.');
    }

    throw error;
  }
}
