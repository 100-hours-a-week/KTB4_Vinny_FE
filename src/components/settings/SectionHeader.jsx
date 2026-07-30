import styles from '@/components/settings/SectionHeader.module.scss';

export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <header className={styles.header}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
