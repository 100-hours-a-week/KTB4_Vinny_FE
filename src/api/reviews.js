import { request } from '@/api/api';
import {
  reviewListSchema,
  reviewSchema,
} from '@/schema/review';

function getAuthorizationHeaders(accessToken) {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
}

export async function getReviews(tmdbMovieId, accessToken, options) {
  const data = await request(`movies/${tmdbMovieId}/reviews`, {
    ...options,
    headers: getAuthorizationHeaders(accessToken),
  });
  const result = reviewListSchema.safeParse(data);

  if (!result.success) {
    throw new Error('리뷰 목록 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function createReview(tmdbMovieId, payload, accessToken) {
  await request(`movies/${tmdbMovieId}/reviews`, {
    method: 'POST',
    headers: getAuthorizationHeaders(accessToken),
    json: payload,
  });
}

export async function updateReview(reviewId, payload, accessToken) {
  const data = await request(`reviews/${reviewId}`, {
    method: 'PUT',
    headers: getAuthorizationHeaders(accessToken),
    json: payload,
  });
  const result = reviewSchema.safeParse(data);

  if (!result.success) {
    throw new Error('리뷰 수정 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function deleteReview(reviewId, accessToken) {
  await request(`reviews/${reviewId}`, {
    method: 'DELETE',
    headers: getAuthorizationHeaders(accessToken),
  });
}
