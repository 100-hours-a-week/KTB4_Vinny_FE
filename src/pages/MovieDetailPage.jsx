import { useParams } from 'react-router-dom';
import MovieDetailHero from '@/components/movie/MovieDetailHero';
import MovieDetailSkeleton from '@/components/movie/MovieDetailSkeleton';
import MovieFeedback from '@/components/movie/MovieFeedback';
import MovieReviewSection from '@/components/review/MovieReviewSection';
import useMovieDetail from '@/hooks/useMovieDetail';

export default function MovieDetailPage() {
  const { tmdbMovieId } = useParams();
  const {
    errorMessage,
    isLoading,
    movie,
    refresh,
    retry,
  } = useMovieDetail(tmdbMovieId);

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (errorMessage || !movie) {
    return (
      <MovieFeedback
        description={errorMessage || '영화 상세 정보가 없습니다.'}
        onRetry={retry}
        title="영화 정보를 표시할 수 없습니다."
      />
    );
  }

  return (
    <>
      <MovieDetailHero movie={movie} />
      <MovieReviewSection
        onMovieChange={refresh}
        tmdbMovieId={tmdbMovieId}
      />
    </>
  );
}
