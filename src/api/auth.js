import { request } from '@/api/api';
import { loginResponseSchema } from '@/schema/auth';

export async function login(payload) {
  const data = await request('login', {
    method: 'POST',
    json: payload,
  });
  const result = loginResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}
