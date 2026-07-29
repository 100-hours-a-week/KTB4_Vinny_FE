import { Outlet } from 'react-router-dom';
import Header from '@/components/header/Header';
import styles from '@/layout/Layout.module.scss';

export default function GlobalLayout() {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
