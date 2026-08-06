/**
 * Axios instance pre-configured for the MtaaFix external API.
 * - Automatically attaches Bearer token from AsyncStorage on every request.
 * - Clears stored auth on 401 (token expired / invalid).
 */
import axios from 'axios';
import { authStore } from '@/src/store/authStore';

const API_BASE = 'https://mtaafix-api.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach Bearer token before every request
apiClient.interceptors.request.use(async (config) => {
  const token = await authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear auth state on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authStore.clearAuth();
    }
    return Promise.reject(error);
  },
);
