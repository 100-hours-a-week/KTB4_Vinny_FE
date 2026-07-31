import { z } from 'zod';
import {
  nicknameSchema,
  passwordConfirmSchema,
  passwordSchema,
  profileImageSchema,
} from '@/schema/validation';

export const userSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(1),
  profileImage: z.string().nullable(),
});

export const profileEditFormSchema = z.object({
  nickname: nicknameSchema,
  profileImage: profileImageSchema,
});

export const profileEditResponseSchema = z.object({
  nickname: nicknameSchema,
  profileImage: z.string().nullable(),
});

export const passwordEditSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '* 비밀번호가 일치하지 않습니다.',
  });
