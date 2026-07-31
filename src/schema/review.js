import { z } from 'zod';

export const reviewSchema = z.object({
  reviewId: z.string().min(1),
  content: z.string(),
  rating: z.number().int().min(1).max(5),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  isOwner: z.boolean(),
  isUpdated: z.boolean(),
  writer: z.object({
    nickname: z.string().min(1),
    profileImage: z.string().nullable(),
  }),
});

export const reviewListSchema = z.object({
  totalReviews: z.number().int().nonnegative(),
  reviews: z.array(reviewSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
});
