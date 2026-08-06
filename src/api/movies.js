import { request } from '@/api/api';
import { movieDetailSchema, movieListSchema } from '@/schema/movie';

async function getMovieList(searchParams, options, path = 'movies') {
  const data = await request(
    `${path}?${searchParams.toString()}`,
    options,
    { suppressUnauthorizedEvent: true },
  );
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

export function searchMovies(query, page = 1, limit = 30, options) {
  const searchParams = new URLSearchParams({
    query,
    page: String(page),
    limit: String(limit),
  });

  return getMovieList(searchParams, options, 'movies/search');
}

export async function getMovieDetail(tmdbMovieId, options) {
  const data = await request(
    `movies/${tmdbMovieId}`,
    options,
    { suppressUnauthorizedEvent: true },
  );
  const result = movieDetailSchema.safeParse(data);

  if (!result.success) {
    throw new Error('영화 상세 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}
