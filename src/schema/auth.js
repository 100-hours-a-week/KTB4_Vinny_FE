import { z } from 'zod';
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
} from '@/utils/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '* 이메일을 입력해주세요')
    .regex(
      EMAIL_PATTERN,
      '* 올바른 이메일 주소 형식을 입력해주세요 (예: example@example.com)',
    ),
  password: z
    .string()
    .min(1, '* 비밀번호를 입력해주세요')
    .regex(
      PASSWORD_PATTERN,
      '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.',
    ),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  userId: z.string().min(1),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '* 이메일을 입력해주세요')
      .regex(
        EMAIL_PATTERN,
        '* 올바른 이메일 주소 형식을 입력해주세요 (예: example@example.com)',
      ),
    password: z
      .string()
      .min(1, '* 비밀번호를 입력해주세요')
      .regex(
        PASSWORD_PATTERN,
        '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.',
      ),
    passwordConfirm: z
      .string()
      .min(1, '* 비밀번호를 한번 더 입력해주세요'),
    nickname: z
      .string()
      .min(1, '* 닉네임을 입력해주세요')
      .min(2, '* 닉네임은 최소 2자 이상 작성해야 합니다.')
      .max(10, '* 닉네임은 최대 10자까지 작성 가능합니다.')
      .regex(/^\S+$/, '* 띄어쓰기를 없애주세요'),
    profileImage: z.any().nullable(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '* 비밀번호와 다릅니다.',
  });

export const signupResponseSchema = z.object({
  userId: z.string().min(1),
});
