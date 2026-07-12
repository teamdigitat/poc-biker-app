import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme, Spacing } from '../shared';

interface BottomNavigationProps extends BaseComponentProps {
  items: { label: string; icon: keyof typeof Ionicons.glyphMap; active?: boolean }[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ items, style }) => {
  const { colors } = useUITheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.outlineVariant }, style]}>
      {items.map((item) => (
        <Pressable key={item.label} style={styles.item}>
          <Ionicons name={item.icon} size={20} color={item.active ? colors.primary : colors.onSurfaceVariant} />
          <Text style={[styles.label, { color: item.active ? colors.primary : colors.onSurfaceVariant }]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing[2],
    borderTopWidth: 1,
  },
  item: {
    alignItems: 'center',
    gap: Spacing[1],
  },
  label: {
    fontSize: 12,
  },
});
