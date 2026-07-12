import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { styles } from './LeftDrawerNav.styles';

interface LeftDrawerNavProps {
  user: any;
  isDark: boolean;
  colors: any;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function LeftDrawerNav({ user, isDark, colors, onThemeToggle, onLogout }: LeftDrawerNavProps) {
  const { logout } = useAuth();
  const { theme } = useCustomTheme();
  const isDarkMode = isDark || theme === 'dark';

  const navItems = [
    { label: 'Dashboard', icon: 'home-outline', active: true },
    { label: 'My Rides', icon: 'bicycle-outline', active: false },
    { label: 'Clubs', icon: 'people-outline', active: false },
    { label: 'Support', icon: 'headset-outline', active: false },
  ];

  return (
    <View pointerEvents="box-none" style={styles.drawerContainer}>
      <View style={[styles.drawerPanel, { backgroundColor: isDarkMode ? '#141517' : '#FFF', borderColor: isDarkMode ? '#2E3236' : '#E1E4E6' }]}> 
        <View style={[styles.profileSection, { borderBottomColor: isDarkMode ? '#2E3236' : '#E1E4E6' }]}> 
          <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}> 
            <Text style={styles.avatarText}>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
            {user?.fullName || 'User'}
          </Text>
          <Text style={[styles.profileUsername, { color: isDarkMode ? '#9BA1A6' : '#687076' }]} numberOfLines={1}>
            @{user?.username || 'username'}
          </Text>
        </View>

        <View style={styles.drawerContent}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.navItem, item.active && { backgroundColor: isDarkMode ? '#2E3236' : '#E8ECEF' }]}
              onPress={() => {}}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={item.active ? colors.tint : isDarkMode ? '#9BA1A6' : '#687076'}
              />
              <Text style={[styles.navText, { color: colors.text, fontWeight: item.active ? '700' : '500' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={[styles.divider, { backgroundColor: isDarkMode ? '#2E3236' : '#E1E4E6' }]} />

          <TouchableOpacity
            style={[styles.bottomButton, { backgroundColor: isDarkMode ? '#2E3236' : '#E8ECEF' }]}
            onPress={onThemeToggle}
          >
            <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={20} color={isDarkMode ? '#F59E0B' : '#4B5563'} />
            <Text style={[styles.bottomButtonText, { color: colors.text }]}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomButton, styles.logoutButton, { backgroundColor: isDarkMode ? '#421E22' : '#FEE2E2' }]}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.bottomButtonText, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
