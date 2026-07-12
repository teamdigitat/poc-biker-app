import React, { createContext, useContext } from "react";
import { useAuthStore } from "../store/auth-store";

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    fullName: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isLoading, hasHydrated, login, register, logout } =
    useAuthStore();

  const isAuthenticated = !!token;
  const isStateLoading = isLoading || !hasHydrated;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading: isStateLoading,
        login,
        register,
        logout: () => logout(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
