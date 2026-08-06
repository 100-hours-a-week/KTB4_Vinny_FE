import { useCallback, useEffect, useState } from 'react';
import {
  createReview as requestCreateReview,
  deleteReview as requestDeleteReview,
  getReviews,
  updateReview as requestUpdateReview,
} from '@/api/reviews';

export default function useReviews({ tmdbMovieId }) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const applyReviewList = useCallback((data) => {
    setReviews(data.reviews);
    setTotalReviews(data.totalReviews);
  }, []);

  const reload = useCallback(async ({
    setErrorOnFailure = true,
    showLoading = true,
    signal,
  } = {}) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getReviews(tmdbMovieId, { signal });
      applyReviewList(data);
      return data;
    } catch (error) {
      if (error.name !== 'AbortError' && setErrorOnFailure) {
        setError(error);
      }
      throw error;
    } finally {
      if (showLoading && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [applyReviewList, tmdbMovieId]);

  useEffect(() => {
    const controller = new AbortController();

    reload({ signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, [reload]);

  const create = async (payload) => {
    setIsSaving(true);

    try {
      return await requestCreateReview(tmdbMovieId, payload);
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
      await requestDeleteReview(reviewId);
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
    error,
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
