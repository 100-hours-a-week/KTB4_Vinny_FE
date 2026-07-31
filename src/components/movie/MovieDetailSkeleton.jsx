import styles from '@/components/movie/MovieDetailSkeleton.module.scss';

export default function MovieDetailSkeleton() {
  return (
    <section aria-label="영화 상세 정보를 불러오는 중" aria-live="polite" className={styles.detail}>
      <div className={styles.breadcrumb} />
      <div className={styles.hero}>
        <div className={styles.poster} />
        <div className={styles.content}>
          <div className={styles.title} />
          <div className={styles.metadata} />
          <div className={styles.rating} />
          <div className={styles.overview} />
        </div>
      </div>
    </section>
  );
}
