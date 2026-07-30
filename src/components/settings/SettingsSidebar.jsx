import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import styles from '@/components/settings/SettingsSidebar.module.scss';

export default function SettingsSidebar() {
  const { user } = useAuth();
  const profileInitial = user.nickname.trim().charAt(0);

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
      </nav>
    </aside>
  );
}
