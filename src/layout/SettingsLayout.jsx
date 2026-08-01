import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { useAuth } from '@/context/auth-context';
import styles from '@/layout/Layout.module.scss';

export default function SettingsLayout() {
  const { isLoggedIn, isLoggingOut } = useAuth();
  const location = useLocation();

  if (isLoggingOut) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <section className={styles.settingsLayout}>
      <SettingsSidebar />
      <main className={styles.settingsContent}>
        <Outlet />
      </main>
    </section>
  );
}
