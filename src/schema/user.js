import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(1),
  profileImage: z.string().nullable(),
});