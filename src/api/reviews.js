import { request } from '@/api/api';
import {
  reviewListSchema,
  reviewSchema,
} from '@/schema/review';

export async function getReviews(tmdbMovieId, options) {
  const data = await request(`movies/${tmdbMovieId}/reviews`, {
    ...options,
  });
  const result = reviewListSchema.safeParse(data);

  if (!result.success) {
    throw new Error('리뷰 목록 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function createReview(tmdbMovieId, payload) {
  await request(`movies/${tmdbMovieId}/reviews`, {
    method: 'POST',
    json: payload,
  });
}

export async function updateReview(reviewId, payload) {
  const data = await request(`reviews/${reviewId}`, {
    method: 'PUT',
    json: payload,
  });
  const result = reviewSchema.safeParse(data);

  if (!result.success) {
    throw new Error('리뷰 수정 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function deleteReview(reviewId) {
  await request(`reviews/${reviewId}`, {
    method: 'DELETE',
  });
}
