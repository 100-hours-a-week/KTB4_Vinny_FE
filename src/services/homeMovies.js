import { getFeaturedMovies, getPopularMovies } from '@/api/movies';

const HOME_MOVIES_CACHE_TTL = 10 * 60 * 1000;

let homeMoviesCache = null;
let homeMoviesCacheExpiresAt = 0;
let pendingHomeMoviesRequest = null;

export function getCachedHomeMovies() {
  if (!homeMoviesCache || Date.now() >= homeMoviesCacheExpiresAt) {
    return null;
  }

  return homeMoviesCache;
}

export async function getHomeMovies({ force = false } = {}) {
  if (!force) {
    const cachedMovies = getCachedHomeMovies();

    if (cachedMovies) {
      return cachedMovies;
    }

    if (pendingHomeMoviesRequest) {
      return pendingHomeMoviesRequest;
    }
  }

  const requestPromise = Promise.all([
    getFeaturedMovies(5),
    getPopularMovies(10),
  ])
    .then(([featuredData, popularData]) => {
      const homeMovies = {
        featuredMovies: featuredData.movies,
        popularMovies: popularData.movies,
      };

      homeMoviesCache = homeMovies;
      homeMoviesCacheExpiresAt = Date.now() + HOME_MOVIES_CACHE_TTL;
      return homeMovies;
    })
    .finally(() => {
      if (pendingHomeMoviesRequest === requestPromise) {
        pendingHomeMoviesRequest = null;
      }
    });

  pendingHomeMoviesRequest = requestPromise;
  return requestPromise;
}
