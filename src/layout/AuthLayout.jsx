import { Outlet } from 'react-router-dom';
import AuthBanner from '@/components/auth/AuthBanner';
import styles from '@/layout/Layout.module.scss';

export default function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <Outlet />
      <AuthBanner />
    </div>
  );
}
