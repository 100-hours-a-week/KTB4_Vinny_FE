import { API_BASE_URL } from '@/api/api';

export function getFullImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl) {
    return '';
  }

  if (
    imageUrl.startsWith('http://')
    || imageUrl.startsWith('https://')
    || imageUrl.startsWith('data:')
    || imageUrl.startsWith('blob:')
  ) {
    return imageUrl;
  }

  if (!API_BASE_URL) {
    return imageUrl;
  }

  return new URL(imageUrl, API_BASE_URL).href;
}
