import { useEffect, useState } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import HomeFeedback from '@/components/home/HomeFeedback';
import HomeSkeleton from '@/components/home/HomeSkeleton';
import MovieSection from '@/components/home/MovieSection';
import { getFeaturedMovies, getPopularMovies } from '@/api/movies';

export default function HomePage() {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const requestOptions = { signal: controller.signal };
        const [featuredData, popularData] = await Promise.all([
          getFeaturedMovies(5, requestOptions),
          getPopularMovies(10, requestOptions),
        ]);

        setFeaturedMovies(featuredData.movies);
        setPopularMovies(popularData.movies);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || '영화 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();
    return () => controller.abort();
  }, [retryCount]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (errorMessage) {
    return (
      <HomeFeedback
        description={errorMessage}
        label="잠시 문제가 발생했어요"
        onRetry={() => setRetryCount((count) => count + 1)}
        title="영화 정보를 불러오지 못했습니다."
      />
    );
  }

  if (featuredMovies.length === 0 && popularMovies.length === 0) {
    return (
      <HomeFeedback
        description="새로운 영화가 준비되면 이곳에서 만나볼 수 있어요."
        label="CINEON"
        title="아직 소개할 영화가 없습니다."
      />
    );
  }

  return (
    <>
      {featuredMovies.length > 0 ? (
        <HeroBanner movies={featuredMovies} />
      ) : (
        <HomeFeedback compact description="현재 추천 영화가 없습니다." />
      )}
      {popularMovies.length > 0 ? (
        <MovieSection movies={popularMovies} />
      ) : (
        <HomeFeedback compact description="현재 인기 영화가 없습니다." />
      )}
    </>
  );
}
