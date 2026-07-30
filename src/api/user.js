import { request } from '@/api/api';
import { profileEditResponseSchema, userSchema } from '@/schema/user';

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

export async function updateUserProfile(payload, accessToken) {
  const formData = new FormData();

  formData.append('nickname', payload.nickname);

  if (payload.profileImage instanceof File) {
    formData.append('profileImage', payload.profileImage);
  }

  const data = await request('users/me/profile', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  const result = profileEditResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error('회원 정보 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function updateUserPassword(payload, accessToken) {
  await request('users/me/password', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: payload,
  });
}
