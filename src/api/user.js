import { request } from '@/api/api';
import { userSchema } from '@/schema/user';

export async function getUser(accessToken) {
  const data = await request('users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = userSchema.safeParse(data);

  if (!result.success) {
    throw new Error('사용자 정보 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}
