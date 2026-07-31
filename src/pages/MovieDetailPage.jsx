import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetail } from '@/api/movies';
import MovieDetailHero from '@/components/movie/MovieDetailHero';
import MovieDetailSkeleton from '@/components/movie/MovieDetailSkeleton';
import MovieFeedback from '@/components/movie/MovieFeedback';
import MovieReviewSection from '@/components/review/MovieReviewSection';

function getDetailErrorMessage(message) {
  if (message === 'MOVIE_NOT_FOUND') {
    return '요청한 영화를 찾을 수 없습니다.';
  }

  if (message === 'MOVIE_BAD_REQUEST') {
    return '올바르지 않은 영화 번호입니다.';
  }

  return message || '영화 상세 정보를 불러오지 못했습니다.';
}

export default function MovieDetailPage() {
  const { tmdbMovieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovieDetail() {
      if (!/^\d+$/.test(tmdbMovieId)) {
        setErrorMessage('올바르지 않은 영화 번호입니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getMovieDetail(tmdbMovieId, {
          signal: controller.signal,
        });
        setMovie(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(getDetailErrorMessage(error.message));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetail();
    return () => controller.abort();
  }, [retryCount, tmdbMovieId]);

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (errorMessage || !movie) {
    return (
      <MovieFeedback
        description={errorMessage || '영화 상세 정보가 없습니다.'}
        onRetry={() => setRetryCount((count) => count + 1)}
        title="영화 정보를 표시할 수 없습니다."
      />
    );
  }

  return (
    <>
      <MovieDetailHero movie={movie} />
      <MovieReviewSection />
    </>
  );
}
