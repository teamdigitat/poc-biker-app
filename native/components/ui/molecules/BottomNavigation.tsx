import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme } from '../shared';

interface BottomNavigationProps extends BaseComponentProps {
  items: { label: string; icon: keyof typeof Ionicons.glyphMap; active?: boolean }[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ items, style }) => {
  const { colors } = useUITheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {items.map((item) => (
        <Pressable key={item.label} style={styles.item}>
          <Ionicons name={item.icon} size={20} color={item.active ? colors.primary : colors.icon} />
          <Text style={[styles.label, { color: item.active ? colors.primary : colors.icon }]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e2e2',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
});
