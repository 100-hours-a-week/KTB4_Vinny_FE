import { useCallback, useEffect, useState } from 'react';
import { getMovieDetail } from '@/api/movies';

function getDetailErrorMessage(error) {
  return error.message || '영화 상세 정보를 불러오지 못했습니다.';
}

export default function useMovieDetail(tmdbMovieId) {
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
          setErrorMessage(getDetailErrorMessage(error));
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

  const refresh = useCallback(async () => {
    try {
      const data = await getMovieDetail(tmdbMovieId);
      setMovie(data);
      return data;
    } catch {
      return null;
    }
  }, [tmdbMovieId]);

  return {
    errorMessage,
    isLoading,
    movie,
    refresh,
    retry: () => setRetryCount((count) => count + 1),
  };
}
