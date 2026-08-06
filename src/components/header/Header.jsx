import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/button/Button';
import { useAuth } from '@/context/auth-context';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/components/header/Header.module.scss';

export default function Header() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const profileInitial = user?.nickname?.trim().charAt(0) || '';
  const profileImageUrl = getFullImageUrl(user?.profileImage);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          className={styles.title}
          to="/"
        >
          CINEON
        </Link>
        <div>
          ci/cd 확인
        </div>
        {!isAuthPage && isLoggedIn ? (
          <Link
            className={styles.profileLink}
            to="/settings"
          >
            <span
              className={styles.avatar}
              style={
                profileImageUrl
                  ? { backgroundImage: `url("${profileImageUrl}")` }
                  : undefined
              }
            >
              {!profileImageUrl && profileInitial}
            </span>
          </Link>
        ) : !isAuthPage ? (
          <Button
            className={styles.loginButton}
            size="small"
            to="/login"
          >
            로그인
          </Button>
        ) : null}
      </div>
    </header >
  );
}
