import ReviewItem from '@/components/review/ReviewItem';
import styles from '@/components/review/ReviewList.module.scss';

export default function ReviewList({
  errorMessage,
  isLoading,
  onDelete,
  onEdit,
  onRetry,
  reviews,
  totalReviews,
}) {
  return (
    <section aria-labelledby="review-list-title" className={styles.section}>
      <h2 id="review-list-title">
        리뷰 <span>{totalReviews}개</span>
      </h2>
      {isLoading ? (
        <div aria-label="리뷰를 불러오는 중" className={styles.loading} role="status">
          <span />
        </div>
      ) : errorMessage ? (
        <div className={styles.error} role="alert">
          <p>{errorMessage}</p>
          <button onClick={onRetry} type="button">다시 시도</button>
        </div>
      ) : reviews.length > 0 ? (
        <div className={styles.list}>
          {reviews.map((review) => (
            <ReviewItem
              key={review.reviewId}
              onDelete={onDelete}
              onEdit={onEdit}
              review={review}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>첫 번째 리뷰를 남겨보세요.</p>
      )}
    </section>
  );
}
