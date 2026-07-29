import styles from '@/components/auth/AuthHeader.module.scss';

export default function AuthHeader({ title, description }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
