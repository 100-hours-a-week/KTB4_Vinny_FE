import { request } from '@/api/api';
import { movieListSchema } from '@/schema/movie';

async function getMovieList(searchParams, options) {
  const data = await request(`movies?${searchParams.toString()}`, options);
  const result = movieListSchema.safeParse(data);

  if (!result.success) {
    throw new Error('영화 목록 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export function getFeaturedMovies(limit = 5, options) {
  return getMovieList(new URLSearchParams({
    featured: 'true',
    limit: String(limit),
  }), options);
}

export function getPopularMovies(limit = 10, options) {
  return getMovieList(new URLSearchParams({
    sort: 'popular',
    limit: String(limit),
  }), options);
}

export function getMovies(page = 1, limit = 30, options) {
  return getMovieList(new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }), options);
}
