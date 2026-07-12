import React from 'react';
import QueryProvider from './query-provider';
import { AuthProvider } from './auth-provider';
import { CustomThemeProvider } from './theme-provider';

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default ProviderWrapper;
