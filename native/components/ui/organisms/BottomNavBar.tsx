import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
interface BottomNavBarProps {
  bottomNavItems: Array<{ icon: string; active: boolean }>;
  isDark: boolean;
  colors: any;
  isQuickActionsOpen: boolean;
  onQuickActionsPress: () => void;
}

export function BottomNavBar({ bottomNavItems, isDark, colors, isQuickActionsOpen, onQuickActionsPress }: BottomNavBarProps) {
  return (
    <View style={[styles.bottomNavWrapper, { backgroundColor: isDark ? '#0E0F11' : '#FFF' }]}> 
      <View style={[styles.bottomNavPill, { backgroundColor: isDark ? '#1B1C1F' : '#F4F5F7' }]}> 
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.bottomNavButton, item.active && styles.bottomNavButtonActive]}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.active ? '#FFF' : isDark ? '#ECECEF' : '#7C7F86'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.bottomNavClose, { backgroundColor: isDark ? '#1B1C1F' : '#F4F5F7' }]}
        onPress={onQuickActionsPress}
      >
        <Ionicons name={isQuickActionsOpen ? 'close' : 'flash-outline'} size={20} color={isDark ? '#ECECEF' : '#2C2E33'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  bottomNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 10,
    gap: 10,
  },
  bottomNavButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavButtonActive: {
    backgroundColor: '#EF4444',
  },
  bottomNavClose: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
