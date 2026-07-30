import { z } from 'zod';

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
