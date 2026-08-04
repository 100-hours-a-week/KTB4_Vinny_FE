import { z } from 'zod';

export const movieSummarySchema = z.object({
  tmdbMovieId: z.number().int().positive(),
  title: z.string().min(1),
  originalTitle: z.string(),
  overview: z.string(),
  rating: z.number().min(0).max(5),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  releaseYear: z.number().int().nullable(),
});

export const movieListSchema = z.object({
  movies: z.array(movieSummarySchema),
  page: z.number().int().positive(),
  nextPage: z.number().int().positive().nullable(),
  hasNext: z.boolean(),
});

export const movieDetailSchema = z.object({
  tmdbMovieId: z.coerce.number().int().positive(),
  title: z.string().min(1),
  overview: z.string(),
  rating: z.number().min(0).max(5),
  cineonRating: z.number().min(0).max(5),
  genres: z.array(z.string()),
  runtime: z.number().int().nonnegative().nullable(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  releaseDate: z.union([z.number().int(), z.string()]).nullable(),
  reviewCount: z.number().int().nonnegative(),
});
