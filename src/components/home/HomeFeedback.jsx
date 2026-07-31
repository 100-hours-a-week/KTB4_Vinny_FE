import Button from '@/components/button/Button';
import styles from '@/components/home/HomeFeedback.module.scss';

export default function HomeFeedback({
  compact = false,
  description,
  label,
  onRetry,
  title,
}) {
  if (compact) {
    return <p className={styles.compact}>{description}</p>;
  }

  return (
    <section className={styles.feedback} role={onRetry ? 'alert' : undefined}>
      {label ? <p className={styles.label}>{label}</p> : null}
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {onRetry ? <Button onClick={onRetry}>다시 시도</Button> : null}
    </section>
  );
}
