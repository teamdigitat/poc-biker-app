import React, { createContext, useContext } from 'react';
import { useAuthStore } from '../store/auth-store';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string, deviceInfo?: any) => Promise<void>;
  register: (email: string, username: string, fullName: string, password: string, deviceInfo?: any) => Promise<void>;
  loginWithGoogle: (idToken: string, deviceInfo?: any) => Promise<void>;
  loginWithApple: (identityToken: string, deviceInfo?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, refreshToken, deviceId, isLoading, hasHydrated, login, register, loginWithGoogle, loginWithApple, logout, refreshAccessToken } = useAuthStore();

  const isAuthenticated = !!token;
  const isStateLoading = isLoading || !hasHydrated;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        deviceId,
        isAuthenticated,
        isLoading: isStateLoading,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
