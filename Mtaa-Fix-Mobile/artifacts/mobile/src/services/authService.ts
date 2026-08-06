/**
 * Raw auth API calls. Business logic (state management) lives in AuthContext.
 *
 * Verified Django endpoints (2026-08-02):
 *   POST /api/auth/login/     — { phone, password } → { user, tokens }
 *   POST /api/auth/register/  — { phone, password, confirm_password, name?, role? } → { user, tokens }
 *   GET  /api/auth/me/        — Bearer → { id, phone, name, role }
 */
import { apiClient } from '@/src/api/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/src/types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/auth/login/', payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/auth/register/', payload);
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get('/api/auth/me/');
    return res.data;
  },
};
