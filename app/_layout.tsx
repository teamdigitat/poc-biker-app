import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ProviderWrapper from '@/src/providers/index';

import { useAuth } from '@/src/providers/auth-provider';
import { useCustomTheme } from '@/src/providers/theme-provider';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, colors } = useCustomTheme();
  const segments = useSegments();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // Mark layout as mounted after the first render completes
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only navigate AFTER the Stack navigator has mounted
  useEffect(() => {
    if (!hasMounted || isLoading) return;

    const currentSegment = segments[segments.length - 1] as string | undefined;
    const inAppGroup = segments[0] === '(app)';
    const isAuthRoute =
      segments[0] === '(auth)' ||
      currentSegment === 'login' ||
      currentSegment === 'register';
    const isRootRoute = !segments.length || currentSegment === 'index';

    if (!isAuthenticated && inAppGroup) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.replace('/');
    } else if (!isAuthenticated && isRootRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments, hasMounted]);

  // Show a loading screen while auth state is hydrating
  if (isLoading || !hasMounted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size='large' color={colors.tint} />
      </View>
    );
  }

  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const customNavTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: colors.background,
      text: colors.text,
      card: colors.background,
    },
  };

  return (
    <ThemeProvider value={customNavTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ProviderWrapper>
      <RootLayoutNav />
    </ProviderWrapper>
  );
}
