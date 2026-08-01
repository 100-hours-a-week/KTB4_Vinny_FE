import { createAuthorizationHeaders, request } from '@/api/api';
import {
  loginResponseSchema,
  signupResponseSchema,
} from '@/schema/auth';

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

export async function signup(payload) {
  const formData = new FormData();

  formData.append('email', payload.email);
  formData.append('password', payload.password);
  formData.append('passwordConfirm', payload.passwordConfirm);
  formData.append('nickname', payload.nickname);

  if (payload.profileImage instanceof File) {
    formData.append('profileImage', payload.profileImage);
  }

  const data = await request('sign-up', {
    method: 'POST',
    body: formData,
  });
  const result = signupResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error('회원가입 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
}

export async function logout(accessToken) {
  await request('logout', {
    method: 'POST',
    headers: createAuthorizationHeaders(accessToken),
  }, {
    suppressUnauthorizedEvent: true,
  });
}
