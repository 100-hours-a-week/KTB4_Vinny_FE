import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getMovieImageUrl } from '@/utils/image';
import styles from '@/components/movie/MovieDetailHero.module.scss';

function getReleaseYear(releaseDate) {
  if (typeof releaseDate === 'number') {
    return releaseDate;
  }

  if (typeof releaseDate === 'string') {
    const [year] = releaseDate.split('-');
    return year || '';
  }

  return '';
}

export default function MovieDetailHero({ movie }) {
  const [hasPosterError, setHasPosterError] = useState(false);
  const [hasBackdropError, setHasBackdropError] = useState(false);
  const posterUrl = getMovieImageUrl(movie.posterPath, 'w500');
  const backdropUrl = getMovieImageUrl(movie.backdropPath, 'w1280');
  const releaseYear = getReleaseYear(movie.releaseDate);
  const metadata = [
    releaseYear,
    movie.genres.length > 0 ? movie.genres.join(' · ') : '',
    movie.runtime ? `${movie.runtime}분` : '',
  ].filter(Boolean);

  return (
    <article className={styles.detail}>
      <nav aria-label="현재 위치" className={styles.breadcrumb}>
        <Link to="/">홈</Link>
        <span aria-hidden="true">›</span>
        <Link to="/movies">영화</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{movie.title}</span>
      </nav>

      <section aria-labelledby="movie-detail-title" className={styles.hero}>
        {backdropUrl && !hasBackdropError ? (
          <img
            alt=""
            className={styles.backdrop}
            onError={() => setHasBackdropError(true)}
            src={backdropUrl}
          />
        ) : null}
        <div className={styles.overlay} />

        <div className={styles.posterFrame}>
          {posterUrl && !hasPosterError ? (
            <img
              alt={`${movie.title} 포스터`}
              className={styles.poster}
              onError={() => setHasPosterError(true)}
              src={posterUrl}
            />
          ) : (
            <div className={styles.posterFallback}>CINEON</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 id="movie-detail-title">{movie.title}</h1>
          {metadata.length > 0 ? (
            <p className={styles.metadata}>{metadata.join(' · ')}</p>
          ) : null}
          <div className={styles.ratings}>
            <div className={styles.rating}>
              <span className={styles.ratingSource}>TMDB</span>
              <span className={styles.ratingValue}>
                <span aria-hidden="true" className={styles.star}>★</span>
                <strong>{movie.rating.toFixed(1)}</strong>
                <span className={styles.ratingScale}>/ 5</span>
              </span>
            </div>
            <div className={`${styles.rating} ${styles.cineonRating}`}>
              <span className={`${styles.ratingSource} ${styles.cineonSource}`}>
                CINEON
              </span>
              {movie.cineonRating > 0 ? (
                <span className={styles.ratingValue}>
                  <span aria-hidden="true" className={styles.star}>★</span>
                  <strong>{movie.cineonRating.toFixed(1)}</strong>
                  <span className={styles.ratingScale}>/ 5</span>
                </span>
              ) : (
                <span className={styles.emptyRating}>평점 없음</span>
              )}
            </div>
          </div>
          <p className={movie.overview ? styles.overview : styles.emptyOverview}>
            {movie.overview || '등록된 줄거리가 없습니다.'}
          </p>
        </div>
      </section>
    </article>
  );
}
