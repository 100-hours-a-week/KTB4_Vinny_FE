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
