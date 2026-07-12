import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LeftDrawerNav } from '@/components/ui/organisms/LeftDrawerNav';
import { BottomNavBar } from '@/components/ui/organisms/BottomNavBar';

const Drawer = createDrawerNavigator();

function AppShell() {
  const { logout } = useAuth();
  const { theme, toggleTheme, colors } = useCustomTheme();
  const router = useRouter();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const isDark = theme === 'dark';

  const bottomNavItems = [
    { icon: 'home', active: true },
    { icon: 'navigate-outline', active: false },
    { icon: 'chatbubble-ellipses-outline', active: false },
    { icon: 'bicycle-outline', active: false },
  ];

  const quickActions = [
    { label: 'Navigation', icon: 'navigate-outline' },
    { label: 'Events', icon: 'calendar-outline' },
    { label: 'Documents', icon: 'folder-open-outline' },
    { label: 'Toggle Theme', icon: isDark ? 'sunny-outline' : 'moon-outline' },
    { label: 'Logout', icon: 'log-out-outline' },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleQuickActionPress = (label: string) => {
    setIsQuickActionsOpen(false);

    if (label === 'Toggle Theme') {
      toggleTheme();
      return;
    }

    if (label === 'Logout') {
      handleLogout();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingBottom: 96 }}>
        <Slot />
      </View>

      <BottomNavBar
        bottomNavItems={bottomNavItems}
        isDark={isDark}
        colors={colors}
        isQuickActionsOpen={isQuickActionsOpen}
        onQuickActionsPress={() => setIsQuickActionsOpen((prev) => !prev)}
      />

      {isQuickActionsOpen && (
        <View style={[styles.quickActionsOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }]}> 
          <View style={[styles.quickActionsPanel, { backgroundColor: isDark ? '#141517' : '#FFF', borderColor: isDark ? '#2E3236' : '#E1E4E6' }]}> 
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickActionItem}
                onPress={() => handleQuickActionPress(action.label)}
              >
                <Ionicons name={action.icon as any} size={20} color={colors.text} />
                <Text style={[styles.quickActionText, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, colors } = useCustomTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    props.navigation.closeDrawer();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#141517' : '#FFF' }}>
      <LeftDrawerNav
        user={user}
        isDark={theme === 'dark'}
        colors={colors}
        onThemeToggle={toggleTheme}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

export default function AppLayout() {
  const { colors } = useCustomTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            width: 282,
            borderRightWidth: 1,
            borderRightColor: 'rgba(255,255,255,0.08)',
          },
          overlayColor: 'rgba(0,0,0,0.35)',
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Dashboard" component={AppShell} />
      </Drawer.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 88,
    left: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    zIndex: 9,
  },
  quickActionsPanel: {
    width: 220,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
