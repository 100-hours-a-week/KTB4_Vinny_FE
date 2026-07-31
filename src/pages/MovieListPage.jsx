import { useEffect, useRef, useState } from 'react';
import { getMovies } from '@/api/movies';
import MovieGridList from '@/components/movie/MovieGridList';
import MovieGridSkeleton from '@/components/movie/MovieGridSkeleton';
import MovieListFeedback from '@/components/movie/MovieListFeedback';

const MOVIES_PER_PAGE = 30;

export default function MovieListPage() {
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
        const data = await getMovies(pageToLoad, MOVIES_PER_PAGE, {
          signal: controller.signal,
        });

        setMovies((currentMovies) => {
          if (pageToLoad === 1) {
            return data.movies;
          }

          const movieIds = new Set(currentMovies.map((movie) => movie.tmdbMovieId));
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
  }, [pageToLoad, retryCount]);

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

  if (isInitialLoading) {
    return <MovieGridSkeleton />;
  }

  if (errorMessage && movies.length === 0) {
    return (
      <MovieListFeedback
        description={errorMessage}
        onRetry={() => setRetryCount((count) => count + 1)}
        title="영화 목록을 불러오지 못했습니다."
      />
    );
  }

  if (movies.length === 0) {
    return (
      <MovieListFeedback
        description="새로운 영화가 준비되면 이곳에서 만나볼 수 있어요."
        title="아직 등록된 영화가 없습니다."
      />
    );
  }

  return (
    <MovieGridList
      errorMessage={errorMessage}
      hasNext={hasNext}
      isLoadingMore={isLoadingMore}
      loadMoreRef={loadMoreRef}
      movies={movies}
      onRetry={() => setRetryCount((count) => count + 1)}
    />
  );
}
