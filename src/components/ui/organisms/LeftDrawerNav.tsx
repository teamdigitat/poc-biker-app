import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useAuth } from '@/src/providers/auth-provider';
import { useCustomTheme } from '@/src/providers/theme-provider';

import { Badge } from '@/src/components/ui/atoms/Badge';
import { drawerNavItems } from '@/src/constants/nav-items';
import {
  Spacing,
  Radius,
  FontSizes,
  Fonts,
  Elevation,
} from '@/src/constants/theme';

interface LeftDrawerNavProps {
  user: any; // TODO: narrow this type — waiting on shared User interface
  isDark: boolean;
  colors: any; // TODO: narrow this type — should be ThemeColors
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
            backgroundColor: isDarkMode ? colors.surface : colors.surface,
            borderColor: colors.outlineVariant,
          },
          Elevation.modal,
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
                      backgroundColor: colors.surfaceContainerHigh,
                    },
                  ]}
                  onPress={() => {
                    // router.push(item.route)
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive ? colors.primary : colors.onSurfaceVariant}
                  />

                  <View style={styles.labelContainer}>
                    <Text
                      style={[
                        styles.navText,
                        {
                          color: colors.text,
                          fontWeight: isActive ? '700' : '500',
                          fontFamily: Fonts?.sans,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {item.comingSoon && (
                      <Badge
                        variant='warning'
                        style={[
                          styles.badge,
                          { paddingHorizontal: 6, paddingVertical: 2 },
                        ]}
                        textStyle={{ fontSize: 6, lineHeight: 12 }}
                      >
                        Coming Soon
                      </Badge>
                    )}

                    {item.underMaintenance && (
                      <Badge
                        variant='error'
                        style={[
                          styles.badge,
                          { paddingHorizontal: 6, paddingVertical: 2 },
                        ]}
                        textStyle={{ fontSize: 10, lineHeight: 12 }}
                      >
                        Maintenance
                      </Badge>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View
            style={[
              styles.actionsSection,
              { paddingBottom: insets.bottom + Spacing[4] },
            ]}
          >
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colors.outlineVariant,
                },
              ]}
            />

            <TouchableOpacity
              style={[
                styles.bottomButton,
                {
                  backgroundColor: colors.surfaceContainerHigh,
                },
              ]}
              onPress={onThemeToggle}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={isDarkMode ? colors.accent : colors.onSurfaceVariant}
              />

              <Text
                style={[
                  styles.bottomButtonText,
                  {
                    color: colors.text,
                    fontFamily: Fonts?.sans,
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
                  backgroundColor: colors.dangerContainer,
                },
              ]}
              onPress={onLogout}
            >
              <Ionicons
                name='log-out-outline'
                size={20}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.bottomButtonText,
                  {
                    color: colors.danger,
                    fontFamily: Fonts?.sans,
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
  },

  drawerContent: {
    flex: 1,
    padding: Spacing[4],
  },

  scrollableSection: {
    flex: 1,
  },

  scrollableContent: {
    paddingBottom: Spacing[2],
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: Radius.md,
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },

  navText: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    flex: 1,
  },

  badge: {
    marginLeft: Spacing[2],
  },

  actionsSection: {
    paddingTop: Spacing[2],
  },

  divider: {
    height: 1,
    marginBottom: Spacing[3],
  },

  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    height: 48,
    borderRadius: Radius.md,
    gap: Spacing[3],
    marginTop: Spacing[1],
  },

  bottomButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },

  logoutButton: {
    marginTop: Spacing[2],
  },
});
