import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout as requestLogout } from '@/api/auth';
import { deleteUser } from '@/api/user';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import useToast from '@/hooks/useToast';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/components/settings/SettingsSidebar.module.scss';

export default function SettingsSidebar() {
  const navigate = useNavigate();
  const { auth, user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    closeToast,
    showError,
    toast,
  } = useToast();
  const profileInitial = user.nickname.trim().charAt(0);
  const profileImageUrl = getFullImageUrl(user.profileImage);

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

  const handleWithdrawal = async () => {
    setIsDeleting(true);

    try {
      await deleteUser(auth.accessToken);
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      setIsWithdrawalDialogOpen(false);
      showError(error.message || '회원 탈퇴에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
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
          <span aria-hidden="true">●</span>
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
        <button
          className={styles.withdrawalButton}
          type="button"
          onClick={() => {
            closeToast();
            setIsWithdrawalDialogOpen(true);
          }}
        >
          <span aria-hidden="true">×</span>
          회원 탈퇴
        </button>
      </div>

      <ConfirmDialog
        open={isWithdrawalDialogOpen}
        title="회원탈퇴 하시겠습니까?"
        description="작성한 리뷰는 알 수 없음 처리 됩니다."
        confirmLabel="확인"
        isPending={isDeleting}
        onCancel={() => setIsWithdrawalDialogOpen(false)}
        onConfirm={handleWithdrawal}
      />

      {toast && (
        <Toast
          variant={toast.variant}
          onClose={closeToast}
        >
          {toast.message}
        </Toast>
      )}
    </aside>
  );
}
