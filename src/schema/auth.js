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
