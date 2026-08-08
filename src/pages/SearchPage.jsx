import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '@/api/movies';
import MovieFeedback from '@/components/movie/MovieFeedback';
import MovieGridList from '@/components/movie/MovieGridList';
import MovieGridSkeleton from '@/components/movie/MovieGridSkeleton';
import useInfiniteMovies from '@/hooks/useInfiniteMovies';

const MOVIES_PER_PAGE = 20;

function SearchResults({ query }) {
  const fetchPage = useCallback(
    (page, limit, options) => searchMovies(query, page, limit, options),
    [query],
  );
  const {
    errorMessage,
    hasNext,
    isInitialLoading,
    isLoadingMore,
    loadMoreRef,
    movies,
    retry,
  } = useInfiniteMovies({ fetchPage, limit: MOVIES_PER_PAGE });

  if (isInitialLoading) {
    return <MovieGridSkeleton />;
  }

  if (errorMessage && movies.length === 0) {
    return (
      <MovieFeedback
        description={errorMessage}
        onRetry={retry}
        title="검색 결과를 불러오지 못했습니다."
      />
    );
  }

  if (movies.length === 0) {
    return (
      <MovieFeedback
        description="다른 제목이나 철자로 다시 검색해보세요."
        title={`‘${query}’ 검색 결과가 없습니다.`}
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
      title={`‘${query}’ 검색 결과`}
    />
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return (
      <MovieFeedback
        description="헤더 검색창에 찾고 싶은 영화 제목을 입력해주세요."
        title="검색어를 입력해주세요."
      />
    );
  }

  return <SearchResults key={query} query={query} />;
}
