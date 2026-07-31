import { useCallback, useEffect, useState } from 'react';
import {
  createReview as requestCreateReview,
  deleteReview as requestDeleteReview,
  getReviews,
  updateReview as requestUpdateReview,
} from '@/api/reviews';

export default function useReviews({ accessToken, tmdbMovieId }) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const applyReviewList = useCallback((data) => {
    setReviews(data.reviews);
    setTotalReviews(data.totalReviews);
  }, []);

  const reload = useCallback(async ({ signal, showLoading = true } = {}) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setErrorMessage('');

    try {
      const data = await getReviews(tmdbMovieId, accessToken, { signal });
      applyReviewList(data);
      return data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrorMessage(error.message || '리뷰 목록을 불러오지 못했습니다.');
      }
      throw error;
    } finally {
      if (showLoading && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [accessToken, applyReviewList, tmdbMovieId]);

  useEffect(() => {
    const controller = new AbortController();

    reload({ signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, [reload]);

  const create = async (payload) => {
    setIsSaving(true);

    try {
      await requestCreateReview(tmdbMovieId, payload, accessToken);
      await reload({ showLoading: false });
    } finally {
      setIsSaving(false);
    }
  };

  const update = async (reviewId, payload) => {
    setIsSaving(true);

    try {
      const updatedReview = await requestUpdateReview(
        reviewId,
        payload,
        accessToken,
      );
      setReviews((currentReviews) => currentReviews.map((review) => (
        review.reviewId === updatedReview.reviewId ? updatedReview : review
      )));
      return updatedReview;
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (reviewId) => {
    setIsDeleting(true);

    try {
      await requestDeleteReview(reviewId, accessToken);
      setReviews((currentReviews) => currentReviews.filter(
        (review) => review.reviewId !== reviewId,
      ));
      setTotalReviews((currentTotal) => Math.max(0, currentTotal - 1));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    create,
    errorMessage,
    isDeleting,
    isLoading,
    isSaving,
    reload,
    remove,
    reviews,
    totalReviews,
    update,
  };
}
