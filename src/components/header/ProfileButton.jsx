import { Link } from 'react-router-dom';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/components/header/ProfileButton.module.scss';

export default function ProfileButton({ user }) {
  const profileInitial = user?.nickname?.trim().charAt(0) || '';
  const profileImageUrl = getFullImageUrl(user?.profileImage);

  return (
    <Link aria-label="설정으로 이동" className={styles.profileLink} to="/settings">
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
  );
}
