import { request } from '@/api/api';
import { refreshCsrfToken } from '@/api/csrf';

export async function login(payload) {
  await request('login', {
    method: 'POST',
    json: payload,
  });
  await refreshCsrfToken();
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

  await request('sign-up', {
    method: 'POST',
    body: formData,
  });
}

export async function logout() {
  await request('logout', {
    method: 'POST',
  }, {
    suppressUnauthorizedEvent: true,
  });
}
