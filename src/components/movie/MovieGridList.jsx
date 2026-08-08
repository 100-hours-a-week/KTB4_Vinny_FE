import MovieCard from '@/components/movie/MovieCard';
import styles from '@/components/movie/MovieGridList.module.scss';

export default function MovieGridList({
  errorMessage,
  hasNext,
  isLoadingMore,
  loadMoreRef,
  movies,
  onRetry,
  title = '전체 영화',
}) {
  const titleId = 'movie-grid-title';

  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <h1 id={titleId}>{title}</h1>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbMovieId} movie={movie} />
        ))}
      </div>

      {errorMessage ? (
        <div className={styles.loadFeedback} role="alert">
          <p>{errorMessage}</p>
          <button onClick={onRetry} type="button">다시 시도</button>
        </div>
      ) : null}

      {isLoadingMore ? (
        <div aria-label="영화를 더 불러오는 중" className={styles.loader} role="status">
          <span />
        </div>
      ) : null}

      {!hasNext && movies.length > 0 ? (
        <p className={styles.endMessage}>모든 영화를 확인했습니다.</p>
      ) : null}

      {hasNext && !errorMessage ? (
        <div aria-hidden="true" className={styles.sentinel} ref={loadMoreRef} />
      ) : null}
    </section>
  );
}
