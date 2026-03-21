import { plubClient } from '../client/client';
import type { AuthUser, LoginPayload, LoginResponse } from '../interfaces/auth';

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return plubClient.post<LoginResponse>('/auth/login', payload).then((res) => res.data);
  },

  async me(): Promise<AuthUser> {
    return plubClient.get<AuthUser>('/auth/me').then((res) => res.data);
  },

  async logout(): Promise<void> {
    await plubClient.post('/auth/logout');
  },
};
