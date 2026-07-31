import { useEffect, useState } from 'react';
import Button from '@/components/Button/Button';
import styles from '@/components/review/ReviewForm.module.scss';

const MAX_CONTENT_LENGTH = 500;

function StarRatingInput({
  disabled,
  isSubmitting,
  onChange,
  onLoginRequired,
  value,
}) {
  const [previewValue, setPreviewValue] = useState(null);
  const displayValue = previewValue ?? value;

  const handleRatingSelect = (nextRating) => {
    if (disabled) {
      onLoginRequired();
      return;
    }

    onChange(nextRating);
    setPreviewValue(null);
  };

  return (
    <div
      aria-label="별점"
      className={styles.stars}
      onMouseLeave={() => setPreviewValue(null)}
      role="radiogroup"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starRating = index + 1;
        const isActive = starRating <= displayValue;

        return (
          <button
            aria-checked={starRating === value}
            aria-disabled={disabled}
            aria-label={`${starRating}점`}
            className={isActive ? styles.activeStar : ''}
            disabled={isSubmitting}
            key={starRating}
            onBlur={() => setPreviewValue(null)}
            onClick={() => handleRatingSelect(starRating)}
            onFocus={() => setPreviewValue(starRating)}
            onMouseEnter={() => setPreviewValue(starRating)}
            onMouseLeave={() => setPreviewValue(null)}
            role="radio"
            type="button"
          >
            {isActive ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({
  editingReview,
  hasOwnReview,
  isLoggedIn,
  isSubmitting,
  onCancelEdit,
  onLoginRequired,
  onSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const isEditing = Boolean(editingReview);
  const isValid = rating > 0 && content.trim().length > 0;

  useEffect(() => {
    setRating(editingReview?.rating ?? 0);
    setContent(editingReview?.content ?? '');
  }, [editingReview]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!isValid) {
      return;
    }

    const didSubmit = await onSubmit({
      content: content.trim(),
      rating,
    });

    if (didSubmit) {
      setRating(0);
      setContent('');
    }
  };

  if (hasOwnReview && !isEditing) {
    return (
      <section className={styles.completed}>
        <strong>리뷰를 작성했습니다.</strong>
        <p>작성한 리뷰의 메뉴에서 내용을 수정하거나 삭제할 수 있습니다.</p>
      </section>
    );
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.ratingArea}>
        <h2>{isEditing ? '내 평점 수정하기' : '내 평점 남기기'}</h2>
        <StarRatingInput
          disabled={!isLoggedIn}
          isSubmitting={isSubmitting}
          onChange={setRating}
          onLoginRequired={onLoginRequired}
          value={rating}
        />
        <p>{rating ? `${rating}점을 선택했습니다.` : '별점을 선택해주세요.'}</p>
      </div>

      <div className={styles.contentArea}>
        <label htmlFor="review-content">
          {isEditing ? '리뷰 수정하기' : '리뷰 작성하기'}
        </label>
        <div className={styles.textareaWrap}>
          <textarea
            disabled={isSubmitting}
            id="review-content"
            maxLength={MAX_CONTENT_LENGTH}
            onChange={(event) => setContent(event.target.value)}
            onClick={() => {
              if (!isLoggedIn) {
                onLoginRequired();
              }
            }}
            placeholder="이 영화에 대한 생각을 자유롭게 남겨주세요!"
            readOnly={!isLoggedIn}
            value={content}
          />
          <span>{content.length}/{MAX_CONTENT_LENGTH}</span>
        </div>
        <div className={styles.actions}>
          {isEditing ? (
            <Button
              disabled={isSubmitting}
              onClick={onCancelEdit}
              variant="secondary"
            >
              취소
            </Button>
          ) : null}
          <Button
            disabled={!isLoggedIn || !isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? '처리 중...'
              : isEditing ? '리뷰 수정' : '리뷰 등록'}
          </Button>
        </div>
      </div>
    </form>
  );
}
