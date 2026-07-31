import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ReviewForm from '@/components/review/ReviewForm';
import ReviewList from '@/components/review/ReviewList';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import { createMockReviews } from '@/mocks/reviews';
import styles from '@/components/review/MovieReviewSection.module.scss';

export default function MovieReviewSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { isLoggedIn, user } = useAuth();
  const [reviews, setReviews] = useState(createMockReviews);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const hasOwnReview = reviews.some((review) => review.isOwner);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleReviewSubmit = ({ content, rating }) => {
    const now = new Date().toISOString();

    if (editingReview) {
      setReviews((currentReviews) => currentReviews.map((review) => (
        review.reviewId === editingReview.reviewId
          ? {
            ...review,
            content,
            rating,
            updatedAt: now,
            isUpdated: true,
          }
          : review
      )));
      setEditingReview(null);
      setToast({ message: '리뷰를 수정했습니다.', variant: 'success' });
      return;
    }

    if (hasOwnReview) {
      setToast({ message: '이미 이 영화에 리뷰를 작성했습니다.', variant: 'error' });
      return;
    }

    setReviews((currentReviews) => [
      {
        reviewId: globalThis.crypto?.randomUUID?.() ?? `review-${Date.now()}`,
        content,
        rating,
        createdAt: now,
        updatedAt: now,
        isOwner: true,
        isUpdated: false,
        writer: {
          nickname: user.nickname,
          profileImage: user.profileImage,
        },
      },
      ...currentReviews,
    ]);
    setToast({ message: '리뷰를 등록했습니다.', variant: 'success' });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleDelete = () => {
    setReviews((currentReviews) => currentReviews.filter(
      (review) => review.reviewId !== reviewToDelete.reviewId,
    ));

    if (editingReview?.reviewId === reviewToDelete.reviewId) {
      setEditingReview(null);
    }

    setReviewToDelete(null);
    setToast({ message: '리뷰를 삭제했습니다.', variant: 'success' });
  };

  return (
    <div className={styles.section} ref={sectionRef}>
      <ReviewForm
        editingReview={editingReview}
        hasOwnReview={hasOwnReview}
        isLoggedIn={isLoggedIn}
        onCancelEdit={() => setEditingReview(null)}
        onLoginRequired={() => setIsLoginDialogOpen(true)}
        onSubmit={handleReviewSubmit}
      />
      <ReviewList
        onDelete={setReviewToDelete}
        onEdit={handleEdit}
        reviews={reviews}
      />

      {isLoginDialogOpen ? (
        <ConfirmDialog
          cancelLabel="취소"
          confirmLabel="로그인하기"
          description="로그인 후 가능한 서비스입니다. 로그인 페이지로 이동합니다."
          onCancel={() => setIsLoginDialogOpen(false)}
          onConfirm={() => navigate('/login')}
          open
          title="로그인이 필요합니다"
        />
      ) : null}
      {reviewToDelete ? (
        <ConfirmDialog
          confirmLabel="삭제하기"
          description="삭제한 리뷰는 복구할 수 없습니다."
          onCancel={() => setReviewToDelete(null)}
          onConfirm={handleDelete}
          open
          title="리뷰를 삭제할까요?"
        />
      ) : null}

      {toast ? (
        <Toast onClose={() => setToast(null)} variant={toast.variant}>
          {toast.message}
        </Toast>
      ) : null}
    </div>
  );
}
