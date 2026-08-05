import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import MovieCard from '@/components/movie/MovieCard';
import styles from '@/components/home/MovieSection.module.scss';

export default function MovieSection({ movies }) {
  const movieListRef = useRef(null);
  const dragStateRef = useRef({ pointerId: null, startX: 0, scrollLeft: 0 });
  const didDragRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const movieList = movieListRef.current;
    if (!movieList) return;

    didDragRef.current = false;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: movieList.scrollLeft,
    };
  };

  const handlePointerMove = (event) => {
    if (
      event.pointerType !== 'mouse' ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const movieList = movieListRef.current;
    if (!movieList) return;

    const distance = event.clientX - dragStateRef.current.startX;
    if (!didDragRef.current && Math.abs(distance) <= 5) return;

    if (!didDragRef.current) {
      didDragRef.current = true;
      movieList.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    movieList.scrollLeft = dragStateRef.current.scrollLeft - distance;
  };

  const stopDragging = (event) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    const movieList = movieListRef.current;
    if (movieList?.hasPointerCapture(event.pointerId)) {
      movieList.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
  };

  const handleClickCapture = (event) => {
    if (!didDragRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  };

  return (
    <section aria-labelledby="popular-movies-title" className={styles.section}>
      <div className={styles.heading}>
        <h2 id="popular-movies-title">지금 인기 있는 영화</h2>
        <Link className={styles.moreLink} to="/movies">
          더보기
          <span aria-hidden="true">›</span>
        </Link>
      </div>
      <div
        className={`${styles.movieList} ${isDragging ? styles.dragging : ''}`}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        ref={movieListRef}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbMovieId} movie={movie} />
        ))}
      </div>
    </section>
  );
}
