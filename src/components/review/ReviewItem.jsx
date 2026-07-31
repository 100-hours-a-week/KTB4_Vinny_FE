import { useEffect, useRef, useState } from 'react';
import { formatRelativeTime } from '@/utils/date';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/components/review/ReviewItem.module.scss';

export default function ReviewItem({ onDelete, onEdit, review }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileImageUrl = getFullImageUrl(review.writer.profileImage);
  const profileInitial = review.writer.nickname.trim().charAt(0);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeMenu);
    return () => document.removeEventListener('pointerdown', closeMenu);
  }, [isMenuOpen]);

  return (
    <article className={styles.item}>
      <div className={styles.author}>
        <div
          className={styles.avatar}
          style={profileImageUrl ? { backgroundImage: `url("${profileImageUrl}")` } : undefined}
        >
          {!profileImageUrl ? profileInitial : null}
        </div>
        <div className={styles.authorInfo}>
          <strong>{review.writer.nickname}</strong>
          <p className={styles.rating} aria-label={`별점 ${review.rating}점`}>
            <span
              aria-hidden="true"
              className={styles.ratingStars}
              style={{ '--rating-fill': `${(review.rating / 5) * 100}%` }}
            >
              <span>☆☆☆☆☆</span>
              <span>★★★★★</span>
            </span>
            <b>{review.rating}</b>
          </p>
          <time dateTime={review.updatedAt}>
            {formatRelativeTime(review.updatedAt)}
            {review.isUpdated ? ' · 수정됨' : ''}
          </time>
        </div>
      </div>

      <p className={styles.content}>{review.content}</p>

      {review.isOwner ? (
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label="리뷰 메뉴 열기"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true">•••</span>
          </button>
          {isMenuOpen ? (
            <div className={styles.menu} role="menu">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(review);
                }}
                role="menuitem"
                type="button"
              >
                수정하기
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(review);
                }}
                role="menuitem"
                type="button"
              >
                삭제하기
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
