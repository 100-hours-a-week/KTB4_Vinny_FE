import styles from '@/components/movie/MovieGridSkeleton.module.scss';

export default function MovieGridSkeleton() {
  return (
    <section aria-label="전체 영화를 불러오는 중" aria-live="polite" className={styles.section}>
      <div className={styles.heading} />
      <div className={styles.grid}>
        {Array.from({ length: 15 }, (_, index) => (
          <div className={styles.card} key={index} />
        ))}
      </div>
    </section>
  );
}
