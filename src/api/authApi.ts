// src/api/authApi.ts
import axiosClient from './axiosClient';
import type { User } from '../features/auth/authTypes';

export type LoginPayload = { identifier: string; password: string };
export type RegisterPayload = { username: string; phoneNumber: string; email: string; password: string };
export type ForgotPasswordPayload = { username: string; phoneNumber: string; newPassword: string };
export type ChangePasswordPayload = { oldPassword: string; newPassword: string };

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// FIX: Định nghĩa và EXPORT interface AddressPayload
export interface AddressPayload {
  label: string;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// Cập nhật UserProfilePayload để sử dụng AddressPayload
export interface UserProfilePayload {
  username: string;
  phoneNumber: string;
  email: string;
  addresses: AddressPayload[];
}

export const authApi = {
  // --- Public APIs ---
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosClient.post('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    axiosClient.post('/auth/register', payload).then((r) => r.data),

  refresh: (refreshToken: string): Promise<{ accessToken: string }> =>
    axiosClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    axiosClient.post('/auth/forgotPassword', payload).then((r) => r.data),

  // --- Secured User APIs ---
  me: (): Promise<User> =>
    axiosClient.get('/secure/users/me').then((r) => r.data),

  changePassword: (payload: ChangePasswordPayload) =>
    axiosClient.post('/secure/users/changepasword', payload).then(r => r.data),

  logout: () =>
    axiosClient.post('/secure/users/logout').then(r => r.data),

  updateProfile: (payload: UserProfilePayload): Promise<User> =>
    axiosClient.put('/secure/users/profile', payload).then(r => r.data),
};