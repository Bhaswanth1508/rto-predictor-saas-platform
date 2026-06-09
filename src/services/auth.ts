export type UserRole = 'brand_owner' | 'admin' | 'team_member';
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  brandName?: string;
}
export async function login(email: string, _password: string): Promise<boolean> {
  // Mock login: Accept any email for demo
  const user: AuthUser = {
    id: 'u_' + Math.random().toString(36).substr(2, 9),
    email,
    role: email.includes('admin') ? 'admin' : 'brand_owner',
    brandName: 'Demo Brand'
  };
  localStorage.setItem('auth_token', 'mock_session_token');
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}
export async function register(email: string, _password: string, brandName: string): Promise<boolean> {
  const user: AuthUser = {
    id: 'u_' + Math.random().toString(36).substr(2, 9),
    email,
    role: 'brand_owner',
    brandName
  };
  localStorage.setItem('auth_token', 'mock_session_token');
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}
export async function forgotPassword(email: string): Promise<void> {
  console.log(`Password reset link requested for ${email}`);
}
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}
export function getCurrentUser(): AuthUser | null {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}