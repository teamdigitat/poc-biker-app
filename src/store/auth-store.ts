import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safePersistStorage } from './custom-storage';
import { apiClient } from '../lib/api-client';
import { setAuthTokenCache } from '../lib/auth-token-store';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  displayName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  isLoading: boolean;
  hasHydrated: boolean;
  login: (emailOrUsername: string, password: string, deviceInfo?: any) => Promise<void>;
  register: (
    email: string,
    username: string,
    fullName: string,
    password: string,
    deviceInfo?: any,
  ) => Promise<void>;
  loginWithGoogle: (idToken: string, deviceInfo?: any) => Promise<void>;
  loginWithApple: (identityToken: string, deviceInfo?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      deviceId: null,
      isLoading: false,
      hasHydrated: false,

      login: async (emailOrUsername, password, deviceInfo) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/login', {
            emailOrUsername,
            password,
            deviceInfo,
          });
          const { accessToken, refreshToken, deviceId, user } = res.data;
          set({
            token: accessToken,
            refreshToken,
            deviceId,
            user,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, username, fullName, password, deviceInfo) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/signup', {
            email,
            username,
            fullName,
            password,
            deviceInfo,
          });
          const { accessToken, refreshToken, deviceId, user } = res.data;
          set({
            token: accessToken,
            refreshToken,
            deviceId,
            user,
            isLoading: false
          });
          setAuthTokenCache(accessToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ token: null, refreshToken: null, user: null, deviceId: null });
        setAuthTokenCache(null);
      },

      refreshAccessToken: async () => {
        const { refreshToken, deviceId } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        try {
          const res = await apiClient.post('/auth/refresh', {
            refreshToken,
            deviceId,
          });
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          set({
            token: accessToken,
            refreshToken: newRefreshToken || refreshToken
          });
          setAuthTokenCache(accessToken);
        } catch (error) {
          set({ token: null, refreshToken: null, user: null, deviceId: null });
          setAuthTokenCache(null);
          throw error;
        }
      },

      loginWithGoogle: async (idToken, deviceInfo) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/google/login', {
            idToken,
            deviceInfo,
          });
          const { accessToken, refreshToken, deviceId, user } = res.data;
          set({
            token: accessToken,
            refreshToken,
            deviceId,
            user,
            isLoading: false
          });
          setAuthTokenCache(accessToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithApple: async (identityToken, deviceInfo) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/apple/login', {
            identityToken,
            deviceInfo,
          });
          const { accessToken, refreshToken, deviceId, user } = res.data;
          set({
            token: accessToken,
            refreshToken,
            deviceId,
            user,
            isLoading: false
          });
          setAuthTokenCache(accessToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: 'biker-auth-storage',
      storage: createJSONStorage(() => safePersistStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
