import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ReviewForm from '@/components/review/ReviewForm';
import ReviewList from '@/components/review/ReviewList';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import useReviews from '@/hooks/useReviews';
import useToast from '@/hooks/useToast';
import { saveLoginRedirectPath } from '@/utils/authRedirect';
import styles from '@/components/review/MovieReviewSection.module.scss';

function getReviewErrorMessage(error) {
  const messages = {
    REVIEW_BAD_REQUEST: '리뷰 내용과 별점을 확인해주세요.',
    REVIEW_NOT_FOUND: '리뷰를 찾을 수 없습니다.',
    UNAUTHORIZED: '로그인이 필요한 서비스입니다.',
    FORBIDDEN_ACCESS: '리뷰를 변경할 권한이 없습니다.',
  };

  return messages[error?.code]
    || error?.message
    || '리뷰 요청에 실패했습니다.';
}

export default function MovieReviewSection({
  onMovieChange,
  tmdbMovieId,
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const [editingReview, setEditingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const {
    closeToast,
    showError,
    showSuccess,
    toast,
  } = useToast();
  const {
    create,
    error,
    isDeleting,
    isLoading,
    isSaving,
    reload,
    remove,
    reviews,
    totalReviews,
    update,
  } = useReviews({ tmdbMovieId });
  const hasOwnReview = reviews.some((review) => review.isOwner);
  const listError = error
    ? getReviewErrorMessage(error)
    : '';

  const handleReviewSubmit = async (payload) => {
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true);
      return false;
    }

    closeToast();

    try {
      if (editingReview) {
        await update(
          editingReview.reviewId,
          payload,
        );
        setEditingReview(null);
        showSuccess('리뷰를 수정했습니다.');
      } else {
        await create(payload);
        showSuccess('리뷰를 등록했습니다.');
      }

      onMovieChange();
      return true;
    } catch (error) {
      showError(getReviewErrorMessage(error));
      return false;
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleDelete = async () => {
    if (!reviewToDelete || !isLoggedIn) {
      return;
    }

    closeToast();

    try {
      await remove(reviewToDelete.reviewId);

      if (editingReview?.reviewId === reviewToDelete.reviewId) {
        setEditingReview(null);
      }

      setReviewToDelete(null);
      showSuccess('리뷰를 삭제했습니다.');
      onMovieChange();
    } catch (error) {
      showError(getReviewErrorMessage(error));
    }
  };

  const handleLoginConfirm = () => {
    saveLoginRedirectPath(`/movies/${tmdbMovieId}`);
    navigate('/login');
  };

  return (
    <div className={styles.section} ref={sectionRef}>
      {!isLoading && !listError ? (
        <ReviewForm
          editingReview={editingReview}
          hasOwnReview={hasOwnReview}
          isLoggedIn={isLoggedIn}
          isSubmitting={isSaving}
          onCancelEdit={() => setEditingReview(null)}
          onLoginRequired={() => setIsLoginDialogOpen(true)}
          onSubmit={handleReviewSubmit}
        />
      ) : null}
      <ReviewList
        errorMessage={listError}
        isLoading={isLoading}
        onDelete={setReviewToDelete}
        onEdit={handleEdit}
        onRetry={() => reload().catch(() => {})}
        reviews={reviews}
        totalReviews={totalReviews}
      />

      {isLoginDialogOpen ? (
        <ConfirmDialog
          cancelLabel="취소"
          confirmLabel="로그인하기"
          description="로그인 후 가능한 서비스입니다. 로그인 페이지로 이동합니다."
          onCancel={() => setIsLoginDialogOpen(false)}
          onConfirm={handleLoginConfirm}
          open
          title="로그인이 필요합니다"
        />
      ) : null}
      {reviewToDelete ? (
        <ConfirmDialog
          confirmLabel="삭제하기"
          description="삭제한 리뷰는 복구할 수 없습니다."
          isPending={isDeleting}
          onCancel={() => setReviewToDelete(null)}
          onConfirm={handleDelete}
          open
          title="리뷰를 삭제할까요?"
        />
      ) : null}

      {toast ? (
        <Toast onClose={closeToast} variant={toast.variant}>
          {toast.message}
        </Toast>
      ) : null}
    </div>
  );
}
