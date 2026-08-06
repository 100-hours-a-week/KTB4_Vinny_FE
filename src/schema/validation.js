import { z } from 'zod';
import {
  EMAIL_PATTERN,
  NICKNAME_PATTERN,
  PASSWORD_PATTERN,
} from '@/utils/pattern';

const MAX_PROFILE_IMAGE_SIZE = 10 * 1024 * 1024;

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
    '* 비밀번호는 8~20자이며, 영문 대문자·소문자·숫자·특수문자(@, $, !, %, *, ?, &)를 각각 1개 이상 포함해야 합니다.',
  );

export const passwordConfirmSchema = z
  .string()
  .min(1, '* 비밀번호를 한 번 더 입력해주세요.');

export const nicknameSchema = z
  .string()
  .min(1, '* 닉네임을 입력해주세요.')
  .min(2, '* 닉네임은 2자 이상이어야 합니다.')
  .max(10, '* 닉네임은 10자 이하여야 합니다.')
  .regex(
    NICKNAME_PATTERN,
    '* 영문, 숫자, 한글, 밑줄(_), 하이픈(-)만 사용할 수 있습니다.',
  );

export const profileImageSchema = z
  .instanceof(File)
  .nullable()
  .refine(
    (file) => !file || file.size <= MAX_PROFILE_IMAGE_SIZE,
    '* 10MB를 초과한 이미지입니다.',
  );
