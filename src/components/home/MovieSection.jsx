import { Link } from 'react-router-dom';
import MovieCard from '@/components/home/MovieCard';
import styles from '@/components/home/MovieSection.module.scss';

export default function MovieSection({ movies }) {
  return (
    <section aria-labelledby="popular-movies-title" className={styles.section}>
      <div className={styles.heading}>
        <h2 id="popular-movies-title">지금 인기 있는 영화</h2>
        <Link className={styles.moreLink} to="/movies">
          더보기
          <span aria-hidden="true">›</span>
        </Link>
      </div>
      <div className={styles.movieList}>
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbMovieId} movie={movie} />
        ))}
      </div>
    </section>
  );
}
