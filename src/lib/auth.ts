import { AuthUser } from '@/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Set cookies so middleware can read role and token
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
  document.cookie = 'role=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
