import { request } from '@/api/api';
import { profileEditResponseSchema, userSchema } from '@/schema/user';

export async function getUser() {
  const data = await request('users/me');
  const result = userSchema.safeParse(data);

  if (!result.success) {
    throw new Error('사용자 정보 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function updateUserProfile(payload) {
  const formData = new FormData();

  formData.append('nickname', payload.nickname);

  if (payload.profileImage instanceof File) {
    formData.append('profileImage', payload.profileImage);
  }

  const data = await request('users/me/profile', {
    method: 'PATCH',
    body: formData,
  });
  const result = profileEditResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error('회원 정보 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function updateUserPassword(payload) {
  await request('users/me/password', {
    method: 'PATCH',
    json: payload,
  });
}

export async function deleteUser() {
  await request('users/me', {
    method: 'DELETE',
  });
}
