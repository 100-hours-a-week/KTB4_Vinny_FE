import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout as requestLogout } from '@/api/auth';
import { useAuth } from '@/context/auth-context';
import styles from '@/components/settings/SettingsSidebar.module.scss';

export default function SettingsSidebar() {
  const navigate = useNavigate();
  const { auth, user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileInitial = user.nickname.trim().charAt(0);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await requestLogout(auth.accessToken);
    } catch {
      // 서버 세션 정리에 실패해도 클라이언트 로그아웃은 계속 진행
    } finally {
      logout();
      navigate('/', { replace: true });
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
        <span
          className={styles.avatar}
          style={
            user.profileImage
              ? { backgroundImage: `url("${user.profileImage}")` }
              : undefined
          }
        >
          {!user.profileImage && profileInitial}
        </span>
        <div className={styles.userText}>
          <strong>{user.nickname}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <nav aria-label="설정 메뉴">
        <NavLink
          className={({ isActive }) => (
            `${styles.navLink} ${isActive ? styles.active : ''}`.trim()
          )}
          to="/settings/profile"
        >
          <span aria-hidden="true">●</span>
          회원 정보 수정
        </NavLink>
        <NavLink
          className={({ isActive }) => (
            `${styles.navLink} ${isActive ? styles.active : ''}`.trim()
          )}
          to="/settings/password"
        >
          <span aria-hidden="true">◆</span>
          비밀번호 변경
        </NavLink>
      </nav>

      <div className={styles.accountActions}>
        <button
          className={styles.logoutButton}
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <span aria-hidden="true">↗</span>
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </aside>
  );
}
