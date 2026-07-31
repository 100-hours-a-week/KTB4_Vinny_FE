import styles from '@/components/home/HomeSkeleton.module.scss';

export default function HomeSkeleton() {
  return (
    <div aria-label="영화 정보를 불러오는 중" aria-live="polite" className={styles.skeleton}>
      <div className={styles.hero} />
      <div className={styles.heading} />
      <div className={styles.cards}>
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.card} key={index} />
        ))}
      </div>
    </div>
  );
}
