import ky from 'ky';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const apiClient = ky.create({
  prefix: API_BASE_URL,
  timeout: 5000,
  credentials: 'include',
});
