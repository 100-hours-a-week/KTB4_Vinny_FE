import styles from '@/components/auth/AuthBanner.module.scss';

const TOP_POSTERS = [
  'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
  'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
  'https://image.tmdb.org/t/p/original/oAt6OtpwYCdJI76AVtVKW1eorYx.jpg',
  'https://image.tmdb.org/t/p/original/2DJCufz3Oa703PbLjNX1pM6MCG2.jpg',
];

const BOTTOM_POSTERS = [
  'https://image.tmdb.org/t/p/w1280/cHS3uVwAyViWcVbpRwrfekgn2cr.jpg',
  'https://image.tmdb.org/t/p/original/moi7AXSaOkIsHAi5h4jdz8ky4h1.jpg',
  'https://image.tmdb.org/t/p/original/vZzHjgSWx3XKT0rLq6tDKzZFce7.jpg',
  'https://image.tmdb.org/t/p/original/7zV8FTYofAORGm0Umgh1mNNCym8.jpg',
  'https://image.tmdb.org/t/p/original/mOP0XWkChKhxuCmjD7CNXpa8M1p.jpg',
];

function PosterTrack({ posters, reverse = false }) {
  const repeatedPosters = [...posters, ...posters];

  return (
    <div
      className={[
        styles.track,
        reverse ? styles.trackReverse : styles.trackForward,
      ].join(' ')}
    >
      {repeatedPosters.map((poster, index) => (
        <img
          key={`${poster}-${index}`}
          className={styles.poster}
          src={poster}
          alt=""
        />
      ))}
    </div>
  );
}

export default function AuthBanner() {
  return (
    <aside className={styles.banner}>
      <PosterTrack posters={TOP_POSTERS} />
      <PosterTrack posters={BOTTOM_POSTERS} reverse />
      <div className={styles.copy}>
        <strong>CINEON</strong>
        <p>한 편의 영화처럼 취향을 기록하세요.</p>
      </div>
    </aside>
  );
}
