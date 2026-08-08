import { Link } from 'react-router-dom';
import styles from '@/components/header/Logo.module.scss';

export default function Logo() {
  return (
    <Link aria-label="CINEON 홈" className={styles.logo} to="/">
      <span>CINE</span>
      <span className={styles.accent}>ON</span>
    </Link>
  );
}
