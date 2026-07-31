import { API_BASE_URL } from '@/api/api';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

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

export function getMovieImageUrl(imagePath, size = 'original') {
  if (typeof imagePath !== 'string' || !imagePath) {
    return '';
  }

  if (
    imagePath.startsWith('http://')
    || imagePath.startsWith('https://')
    || imagePath.startsWith('data:')
    || imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith('/')
    ? imagePath
    : `/${imagePath}`;

  return `${TMDB_IMAGE_BASE_URL}/${size}${normalizedPath}`;
}
