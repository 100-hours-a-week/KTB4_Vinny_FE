import { Link } from 'react-router-dom';
import Button from '@/components/Button/Button';
import styles from '@/components/header/Header.module.scss';

export default function Header() {
  // TODO: AuthProvider 구현 후 로그인 상태와 프로필 이미지로 교체
  const isLoggedIn = false;
  const profileImage = '';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          className={styles.logo}
          to="/"
        >
          CINEON
        </Link>
        {isLoggedIn ? (
          <Link
            className={styles.profileLink}
            to="/settings/profile"
          >
            <span
              className={styles.avatar}
              style={
                profileImage
                  ? { backgroundImage: `url("${profileImage}")` }
                  : undefined
              }
            />
          </Link>
        ) : (
          <Button
            className={styles.loginButton}
            size="small"
            to="/login"
          >
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}
