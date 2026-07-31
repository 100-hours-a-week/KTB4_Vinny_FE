import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from '@/api/reviews';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ReviewForm from '@/components/review/ReviewForm';
import ReviewList from '@/components/review/ReviewList';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import styles from '@/components/review/MovieReviewSection.module.scss';

function getReviewErrorMessage(message) {
  const messages = {
    REVIEW_BAD_REQUEST: '리뷰 내용과 별점을 확인해주세요.',
    REVIEW_NOT_FOUND: '리뷰를 찾을 수 없습니다.',
    UNAUTHORIZED: '로그인이 필요한 서비스입니다.',
    FORBIDDEN_ACCESS: '리뷰를 변경할 권한이 없습니다.',
  };

  return messages[message] || message || '리뷰 요청에 실패했습니다.';
}

export default function MovieReviewSection({
  onMovieChange,
  tmdbMovieId,
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { auth, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const hasOwnReview = reviews.some((review) => review.isOwner);
  const accessToken = auth?.accessToken;

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      setIsLoading(true);
      setListError('');

      try {
        const data = await getReviews(tmdbMovieId, accessToken, {
          signal: controller.signal,
        });
        setReviews(data.reviews);
        setTotalReviews(data.totalReviews);
        setEditingReview(null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setListError(getReviewErrorMessage(error.message));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadReviews();
    return () => controller.abort();
  }, [accessToken, reloadCount, tmdbMovieId]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const reloadReviews = async () => {
    const data = await getReviews(tmdbMovieId, accessToken);
    setReviews(data.reviews);
    setTotalReviews(data.totalReviews);
  };

  const handleReviewSubmit = async (payload) => {
    if (!accessToken) {
      setIsLoginDialogOpen(true);
      return false;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      if (editingReview) {
        const updatedReview = await updateReview(
          editingReview.reviewId,
          payload,
          accessToken,
        );
        setReviews((currentReviews) => currentReviews.map((review) => (
          review.reviewId === updatedReview.reviewId ? updatedReview : review
        )));
        setEditingReview(null);
        setToast({ message: '리뷰를 수정했습니다.', variant: 'success' });
      } else {
        await createReview(tmdbMovieId, payload, accessToken);
        await reloadReviews();
        setToast({ message: '리뷰를 등록했습니다.', variant: 'success' });
      }

      onMovieChange();
      return true;
    } catch (error) {
      setToast({
        message: getReviewErrorMessage(error.message),
        variant: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleDelete = async () => {
    if (!reviewToDelete || !accessToken) {
      return;
    }

    setIsDeleting(true);
    setToast(null);

    try {
      await deleteReview(reviewToDelete.reviewId, accessToken);
      setReviews((currentReviews) => currentReviews.filter(
        (review) => review.reviewId !== reviewToDelete.reviewId,
      ));
      setTotalReviews((currentTotal) => Math.max(0, currentTotal - 1));

      if (editingReview?.reviewId === reviewToDelete.reviewId) {
        setEditingReview(null);
      }

      setReviewToDelete(null);
      setToast({ message: '리뷰를 삭제했습니다.', variant: 'success' });
      onMovieChange();
    } catch (error) {
      setToast({
        message: getReviewErrorMessage(error.message),
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.section} ref={sectionRef}>
      {!isLoading && !listError ? (
        <ReviewForm
          editingReview={editingReview}
          hasOwnReview={hasOwnReview}
          isLoggedIn={isLoggedIn}
          isSubmitting={isSubmitting}
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
        onRetry={() => setReloadCount((count) => count + 1)}
        reviews={reviews}
        totalReviews={totalReviews}
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
          isPending={isDeleting}
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
