import Button from '@/components/Button/Button';
import styles from '@/components/movie/MovieListFeedback.module.scss';

export default function MovieListFeedback({
  description,
  onRetry,
  title,
}) {
  return (
    <section className={styles.feedback} role={onRetry ? 'alert' : undefined}>
      <p className={styles.label}>MOVIES</p>
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {onRetry ? <Button onClick={onRetry}>다시 시도</Button> : null}
    </section>
  );
}
