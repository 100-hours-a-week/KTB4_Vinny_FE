import { useEffect, useRef, useState } from 'react';
import { getMovies } from '@/api/movies';

export default function useInfiniteMovies({
  fetchPage = getMovies,
  limit = 30,
} = {}) {
  const loadMoreRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [pageToLoad, setPageToLoad] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const isFirstPage = pageToLoad === 1;

    async function loadMovies() {
      if (isFirstPage) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setErrorMessage('');

      try {
        const data = await fetchPage(pageToLoad, limit, {
          signal: controller.signal,
        });

        setMovies((currentMovies) => {
          if (isFirstPage) {
            return data.movies;
          }

          const movieIds = new Set(
            currentMovies.map((movie) => movie.tmdbMovieId),
          );
          const nextMovies = data.movies.filter(
            (movie) => !movieIds.has(movie.tmdbMovieId),
          );

          return [...currentMovies, ...nextMovies];
        });
        setNextPage(data.nextPage);
        setHasNext(data.hasNext);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || '영화 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    loadMovies();
    return () => controller.abort();
  }, [fetchPage, limit, pageToLoad, retryCount]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNext || !nextPage || isLoadingMore || errorMessage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPageToLoad(nextPage);
        }
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [errorMessage, hasNext, isLoadingMore, nextPage]);

  return {
    errorMessage,
    hasNext,
    isInitialLoading,
    isLoadingMore,
    loadMoreRef,
    movies,
    retry: () => setRetryCount((count) => count + 1),
  };
}
