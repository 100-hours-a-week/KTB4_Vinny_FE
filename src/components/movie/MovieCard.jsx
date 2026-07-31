import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getMovieImageUrl } from '@/utils/image';
import styles from '@/components/movie/MovieCard.module.scss';

export default function MovieCard({ movie }) {
  const [hasImageError, setHasImageError] = useState(false);
  const posterUrl = getMovieImageUrl(movie.posterPath, 'w500');

  return (
    <article className={styles.card}>
      <Link
        aria-label={`${movie.title} 상세 보기`}
        className={styles.link}
        to={`/movies/${movie.tmdbMovieId}`}
      >
        <div className={styles.posterFrame}>
          {posterUrl && !hasImageError ? (
            <img
              alt={`${movie.title} 포스터`}
              className={styles.poster}
              loading="lazy"
              onError={() => setHasImageError(true)}
              src={posterUrl}
            />
          ) : (
            <div className={styles.posterFallback}>
              <span>CINEON</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          <p aria-label={`별점 ${movie.rating.toFixed(1)}점`} className={styles.rating}>
            <span aria-hidden="true">★</span>
            {movie.rating.toFixed(1)}
          </p>
        </div>
      </Link>
    </article>
  );
}
