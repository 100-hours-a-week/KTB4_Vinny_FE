import { useEffect, useState } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import HomeFeedback from '@/components/home/HomeFeedback';
import HomeSkeleton from '@/components/home/HomeSkeleton';
import MovieSection from '@/components/home/MovieSection';
import { getCachedHomeMovies, getHomeMovies } from '@/services/homeMovies';

export default function HomePage() {
  const [initialMovies] = useState(getCachedHomeMovies);
  const [featuredMovies, setFeaturedMovies] = useState(
    initialMovies?.featuredMovies ?? [],
  );
  const [popularMovies, setPopularMovies] = useState(
    initialMovies?.popularMovies ?? [],
  );
  const [isLoading, setIsLoading] = useState(!initialMovies);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadMovies() {
      if (retryCount > 0 || !getCachedHomeMovies()) {
        setIsLoading(true);
      }
      setErrorMessage('');

      try {
        const homeMovies = await getHomeMovies({ force: retryCount > 0 });

        if (isCancelled) {
          return;
        }

        setFeaturedMovies(homeMovies.featuredMovies);
        setPopularMovies(homeMovies.popularMovies);
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error.message || '영화 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();
    return () => {
      isCancelled = true;
    };
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
