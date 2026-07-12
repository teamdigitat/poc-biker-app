import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safePersistStorage } from './custom-storage';
import { apiClient } from '../lib/api-client';

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
  isLoading: boolean;
  hasHydrated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    fullName: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      hasHydrated: false,

      login: async (emailOrUsername, password) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/login', {
            emailOrUsername,
            password,
          });
          const { token, user } = res.data;
          set({ token, user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, username, fullName, password) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post('/auth/signup', {
            email,
            username,
            fullName,
            password,
          });
          const { token, user } = res.data;
          set({ token, user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ token: null, user: null });
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
