import ky, { HTTPError, TimeoutError } from 'ky';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/`
  : undefined;

const api = ky.create({
  baseUrl: apiBaseUrl,
  timeout: 5000,
});

export async function request(path, options) {
  if (!apiBaseUrl) {
    throw new Error('API 주소가 설정되지 않았습니다.');
  }

  try {
    const response = await api(path, options);

    if (response.status === 204) {
      return;
    }

    const apiResponse = await response.json();

    if (apiResponse?.success === false) {
      throw new Error(apiResponse.message || '요청에 실패했습니다.');
    }

    return apiResponse?.data;
  } catch (error) {
    if (error instanceof HTTPError) {
      const apiError = await error.response.json().catch(() => null);

      throw new Error(apiError?.message || '요청에 실패했습니다.');
    }

    if (error instanceof TimeoutError) {
      throw new Error('요청 시간이 초과되었습니다.');
    }

    throw error;
  }
}
