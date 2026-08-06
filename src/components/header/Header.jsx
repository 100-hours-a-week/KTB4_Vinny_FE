import { useLocation } from 'react-router-dom';
import Logo from '@/components/header/logo';
import LoginButton from '@/components/header/LoginButton';
import ProfileButton from '@/components/header/ProfileButton';
import SearchBar from '@/components/header/SearchBar';
import { useAuth } from '@/context/auth-context';
import styles from '@/components/header/Header.module.scss';

export default function Header() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        {!isAuthPage ? <SearchBar /> : null}
        {!isAuthPage && isLoggedIn ? <ProfileButton user={user} /> : null}
        {!isAuthPage && !isLoggedIn ? <LoginButton /> : null}
      </div>
    </header>
  );
}
