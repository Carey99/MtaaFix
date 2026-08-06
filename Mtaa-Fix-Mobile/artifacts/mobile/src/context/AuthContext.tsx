/**
 * AuthContext — provides auth state and actions to the entire app.
 * - Rehydrates from AsyncStorage on mount (isLoading = true during this phase).
 * - Exposes login / register / logout with side-effects on storage and state.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStore } from '@/src/store/authStore';
import { authService } from '@/src/services/authService';
import type { LoginPayload, RegisterPayload, User, UserRole } from '@/src/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await authStore.getAuthState();
        if (stored.token) {
          setToken(stored.token);
          setUser({
            id: stored.id ?? '',
            phone: stored.phone ?? '',
            role: (stored.role as UserRole) ?? 'worker',
            name: stored.name ?? undefined,
          });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    // API returns { user: {...}, tokens: { access, refresh } }
    const data = await authService.login(payload);
    const accessToken = data.tokens.access;
    const userObj: User = {
      id: data.user.id,
      phone: data.user.phone,
      role: data.user.role,
      name: data.user.name || undefined,
    };
    await authStore.saveAuth({
      token: accessToken,
      refreshToken: data.tokens.refresh,
      role: userObj.role,
      name: userObj.name,
      id: userObj.id,
      phone: userObj.phone,
    });
    setToken(accessToken);
    setUser(userObj);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    // API returns { user: {...}, tokens: { access, refresh } }
    const data = await authService.register(payload);
    const accessToken = data.tokens.access;
    const userObj: User = {
      id: data.user.id,
      phone: data.user.phone,
      role: data.user.role,
      name: data.user.name || undefined,
    };
    await authStore.saveAuth({
      token: accessToken,
      refreshToken: data.tokens.refresh,
      role: userObj.role,
      name: userObj.name,
      id: userObj.id,
      phone: userObj.phone,
    });
    setToken(accessToken);
    setUser(userObj);
  }, []);

  const logout = useCallback(async () => {
    await authStore.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
