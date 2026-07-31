import ReviewItem from '@/components/review/ReviewItem';
import styles from '@/components/review/ReviewList.module.scss';

export default function ReviewList({ onDelete, onEdit, reviews }) {
  return (
    <section aria-labelledby="review-list-title" className={styles.section}>
      <h2 id="review-list-title">
        리뷰 <span>{reviews.length}개</span>
      </h2>
      {reviews.length > 0 ? (
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
