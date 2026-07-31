import { z } from 'zod';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/utils/pattern';

export const emailSchema = z
  .string()
  .min(1, '* 이메일을 입력해주세요.')
  .regex(
    EMAIL_PATTERN,
    '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)',
  );

export const passwordSchema = z
  .string()
  .min(1, '* 비밀번호를 입력해주세요.')
  .regex(
    PASSWORD_PATTERN,
    '* 비밀번호는 8~20자이며, 영문 대문자·소문자·숫자·특수문자를 각각 1개 이상 포함해야 합니다.',
  );

export const passwordConfirmSchema = z
  .string()
  .min(1, '* 비밀번호를 한 번 더 입력해주세요.');

export const nicknameSchema = z
  .string()
  .min(1, '* 닉네임을 입력해주세요.')
  .min(2, '* 닉네임은 최소 2자 이상 작성해야 합니다.')
  .max(10, '* 닉네임은 최대 10자까지 작성 가능합니다.')
  .regex(/^\S+$/, '* 띄어쓰기를 없애주세요.');

export const profileImageSchema = z.instanceof(File).nullable();
