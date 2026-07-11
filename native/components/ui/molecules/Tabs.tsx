import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface TabsProps extends BaseComponentProps {
  variant?: 'fixed' | 'scrollable';
  items: { label: string; value: string; disabled?: boolean }[];
  activeValue?: string;
  onChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ variant = 'fixed', items, activeValue, onChange, style }) => {
  const { colors, isDark } = useUITheme();
  const content = (
    <View style={[styles.row, variant === 'fixed' && styles.fixed]}>
      {items.map((item) => {
        const active = item.value === activeValue;
        return (
          <Pressable
            key={item.value}
            disabled={item.disabled}
            onPress={() => onChange?.(item.value)}
            style={[
              styles.tab,
              active && { backgroundColor: colors.primary },
              !active && { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow },
              item.disabled && { opacity: 0.5 },
            ]}
          >
            <Text style={[styles.label, { color: active ? '#FFF' : colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (variant === 'scrollable') {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style}>{content}</ScrollView>;
  }

  return <View style={style}>{content}</View>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  fixed: {
    justifyContent: 'space-between',
  },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
