import { z } from 'zod';
import {
  emailSchema,
  nicknameSchema,
  passwordConfirmSchema,
  passwordSchema,
  profileImageSchema,
} from '@/schema/validation';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  userId: z.string().min(1),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
    nickname: nicknameSchema,
    profileImage: profileImageSchema,
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '* 비밀번호와 다릅니다.',
  });

export const signupResponseSchema = z.object({
  userId: z.string().min(1),
});
