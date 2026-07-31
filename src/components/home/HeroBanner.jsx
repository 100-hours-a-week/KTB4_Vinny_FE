import { useEffect, useState } from 'react';
import Button from '@/components/Button/Button';
import { getMovieImageUrl } from '@/utils/image';
import styles from '@/components/home/HeroBanner.module.scss';

const AUTOPLAY_DELAY = 4000;

function ChevronIcon({ direction }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function HeroBanner({ movies }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const activeMovie = movies[activeIndex];

  useEffect(() => {
    if (activeIndex >= movies.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, movies.length]);

  useEffect(() => {
    if (movies.length < 2 || isPaused) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timerId);
  }, [isPaused, movies.length]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    setHasImageError(false);
  }, [activeIndex]);

  if (!activeMovie) {
    return null;
  }

  const showPrevious = () => {
    setActiveIndex((activeIndex - 1 + movies.length) % movies.length);
  };
  const showNext = () => {
    setActiveIndex((activeIndex + 1) % movies.length);
  };
  const backdropUrl = getMovieImageUrl(activeMovie.backdropPath, 'w1280');

  return (
    <section
      aria-label="추천 영화"
      className={styles.hero}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {backdropUrl && !hasImageError ? (
        <img
          alt=""
          className={styles.backdrop}
          key={backdropUrl}
          onError={() => setHasImageError(true)}
          src={backdropUrl}
        />
      ) : null}
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>추천 영화</p>
        <h1 className={styles.title}>{activeMovie.title}</h1>
        <p className={styles.meta}>
          <span>{activeMovie.originalTitle}</span>
          {activeMovie.releaseYear ? <span>{activeMovie.releaseYear}</span> : null}
        </p>
        {activeMovie.overview ? (
          <p className={styles.overview}>{activeMovie.overview}</p>
        ) : (
          <p className={styles.overviewMuted}>등록된 줄거리가 없습니다.</p>
        )}
        <Button
          className={styles.detailButton}
          to={`/movies/${activeMovie.tmdbMovieId}`}
        >
          자세히 보기
          <span aria-hidden="true">▶</span>
        </Button>
      </div>

      {movies.length > 1 ? (
        <>
          <button
            aria-label="이전 추천 영화"
            className={`${styles.navigationButton} ${styles.previousButton}`}
            onClick={showPrevious}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            aria-label="다음 추천 영화"
            className={`${styles.navigationButton} ${styles.nextButton}`}
            onClick={showNext}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
          <div aria-label="추천 영화 선택" className={styles.indicators} role="group">
            {movies.map((movie, index) => (
              <button
                aria-label={`${index + 1}번째 추천 영화: ${movie.title}`}
                aria-pressed={index === activeIndex}
                className={styles.indicator}
                key={movie.tmdbMovieId}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
