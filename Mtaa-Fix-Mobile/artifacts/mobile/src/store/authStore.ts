/**
 * Thin AsyncStorage wrapper for persisting auth credentials.
 * All keys are namespaced under "mtaa_" to avoid collisions.
 *
 * Matches the Django backend's user shape: { id, phone, name, role }
 * The backend does not use usernames — phone is the login identifier.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const K = {
  ACCESS_TOKEN: 'mtaa_access_token',
  REFRESH_TOKEN: 'mtaa_refresh_token',
  USER_ROLE: 'mtaa_user_role',
  USER_NAME: 'mtaa_user_name',
  USER_ID: 'mtaa_user_id',
  USER_PHONE: 'mtaa_user_phone',
} as const;

export interface StoredAuthData {
  token: string | null;
  role: string | null;
  name: string | null;
  id: string | null;
  phone: string | null;
}

export const authStore = {
  async saveAuth(data: {
    token: string;
    refreshToken?: string;
    role: string;
    name?: string;
    id?: string;
    phone?: string;
  }): Promise<void> {
    await AsyncStorage.multiSet([
      [K.ACCESS_TOKEN, data.token],
      [K.REFRESH_TOKEN, data.refreshToken ?? ''],
      [K.USER_ROLE, data.role],
      [K.USER_NAME, data.name ?? ''],
      [K.USER_ID, data.id ?? ''],
      [K.USER_PHONE, data.phone ?? ''],
    ]);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(K.ACCESS_TOKEN);
  },

  async getAuthState(): Promise<StoredAuthData> {
    const pairs = await AsyncStorage.multiGet(Object.values(K));
    const map = Object.fromEntries(pairs) as Record<string, string | null>;
    return {
      token: map[K.ACCESS_TOKEN] ?? null,
      role: map[K.USER_ROLE] ?? null,
      name: map[K.USER_NAME] ?? null,
      id: map[K.USER_ID] ?? null,
      phone: map[K.USER_PHONE] ?? null,
    };
  },

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(K));
  },
};
