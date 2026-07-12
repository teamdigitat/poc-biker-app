import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';

import { Badge } from '@/components/ui/atoms/Badge';
import { drawerNavItems } from '@/constants/nav-items';

interface LeftDrawerNavProps {
  user: any;
  isDark: boolean;
  colors: any;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function LeftDrawerNav({
  user,
  isDark,
  colors,
  onThemeToggle,
  onLogout,
}: LeftDrawerNavProps) {
  const { logout } = useAuth();
  const { theme } = useCustomTheme();
  const insets = useSafeAreaInsets();

  const isDarkMode = isDark || theme === 'dark';

  // TODO:
  // Replace this with the current route using Expo Router.
  // const pathname = usePathname();
  // const isActive = pathname === item.route;

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left']}
      style={styles.drawerContainer}
    >
      <View
        style={[
          styles.drawerPanel,
          {
            backgroundColor: isDarkMode ? '#141517' : '#FFF',
            borderColor: isDarkMode ? '#2E3236' : '#E1E4E6',
          },
        ]}
      >
        <View style={styles.drawerContent}>
          <ScrollView
            style={styles.scrollableSection}
            contentContainerStyle={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
          >
            {drawerNavItems.map((item) => {
              const isActive = item.id === 'dashboard';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.navItem,
                    isActive && {
                      backgroundColor: isDarkMode ? '#2E3236' : '#E8ECEF',
                    },
                  ]}
                  onPress={() => {
                    // router.push(item.route)
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={
                      isActive
                        ? colors.tint
                        : isDarkMode
                        ? '#9BA1A6'
                        : '#687076'
                    }
                  />

                  <View style={styles.labelContainer}>
                    <Text
                      style={[
                        styles.navText,
                        {
                          color: colors.text,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {item.comingSoon && (
                      <Badge variant="warning" style={styles.badge}>
                        Coming Soon
                      </Badge>
                    )}

                    {item.underMaintenance && (
                      <Badge variant="error" style={styles.badge}>
                        Maintenance
                      </Badge>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[styles.actionsSection, { paddingBottom: insets.bottom + 16 }]}> 
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: isDarkMode ? '#2E3236' : '#E1E4E6',
                },
              ]}
            />

            <TouchableOpacity
              style={[
                styles.bottomButton,
                {
                  backgroundColor: isDarkMode ? '#2E3236' : '#E8ECEF',
                },
              ]}
              onPress={onThemeToggle}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={isDarkMode ? '#F59E0B' : '#4B5563'}
              />

              <Text
                style={[
                  styles.bottomButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomButton,
                styles.logoutButton,
                {
                  backgroundColor: isDarkMode ? '#421E22' : '#FEE2E2',
                },
              ]}
              onPress={onLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#EF4444"
              />

              <Text
                style={[
                  styles.bottomButtonText,
                  {
                    color: '#EF4444',
                  },
                ]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 20,
  },

  drawerPanel: {
    flex: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },

  drawerContent: {
    flex: 1,
    padding: 16,
  },

  scrollableSection: {
    flex: 1,
  },

  scrollableContent: {
    paddingBottom: 8,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },

  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  navText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },

  badge: {
    marginLeft: 8,
  },

  actionsSection: {
    paddingTop: 8,
  },

  divider: {
    height: 1,
    marginBottom: 12,
  },

  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
  },

  bottomButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  logoutButton: {
    marginTop: 8,
  },
});