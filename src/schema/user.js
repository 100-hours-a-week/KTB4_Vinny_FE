import { z } from 'zod';
import { PASSWORD_PATTERN } from '@/utils/validation';

export const nicknameSchema = z
  .string()
  .min(1, '* 닉네임을 입력해주세요.')
  .min(2, '* 닉네임은 최소 2자 이상 작성해야 합니다.')
  .max(10, '* 닉네임은 최대 10자까지 작성 가능합니다.')
  .regex(/^\S+$/, '* 띄어쓰기를 없애주세요.');

export const userSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(1),
  profileImage: z.string().nullable(),
});

export const profileEditFormSchema = z.object({
  nickname: nicknameSchema,
  profileImage: z.any().nullable(),
});

export const profileEditResponseSchema = z.object({
  nickname: nicknameSchema,
  profileImage: z.string().nullable(),
});

export const passwordChangeSchema = z
  .object({
    password: z
      .string()
      .min(1, '* 비밀번호를 입력해주세요.')
      .regex(
        PASSWORD_PATTERN,
        '* 비밀번호는 8~20자이며, 영문 대문자·소문자·숫자·특수문자를 각각 1개 이상 포함해야 합니다.',
      ),
    passwordConfirm: z
      .string()
      .min(1, '* 비밀번호를 한 번 더 입력해주세요.'),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    path: ['passwordConfirm'],
    message: '* 비밀번호가 일치하지 않습니다.',
  });
