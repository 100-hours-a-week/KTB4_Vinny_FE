import MovieFeedback from '@/components/movie/MovieFeedback';
import MovieGridList from '@/components/movie/MovieGridList';
import MovieGridSkeleton from '@/components/movie/MovieGridSkeleton';
import useInfiniteMovies from '@/hooks/useInfiniteMovies';

const MOVIES_PER_PAGE = 30;

export default function MovieListPage() {
  const {
    errorMessage,
    hasNext,
    isInitialLoading,
    isLoadingMore,
    loadMoreRef,
    movies,
    retry,
  } = useInfiniteMovies({ limit: MOVIES_PER_PAGE });

  if (isInitialLoading) {
    return <MovieGridSkeleton />;
  }

  if (errorMessage && movies.length === 0) {
    return (
      <MovieFeedback
        description={errorMessage}
        onRetry={retry}
        title="영화 목록을 불러오지 못했습니다."
      />
    );
  }

  if (movies.length === 0) {
    return (
      <MovieFeedback
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
      onRetry={retry}
    />
  );
}
