import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme, Spacing, Radius } from '../shared';

interface TabsProps extends BaseComponentProps {
  variant?: 'fixed' | 'scrollable';
  items: { label: string; value: string; disabled?: boolean }[];
  activeValue?: string;
  onChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ variant = 'fixed', items, activeValue, onChange, style }) => {
  const { colors } = useUITheme();
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
              !active && { backgroundColor: colors.surfaceContainer },
              item.disabled && { opacity: 0.5 },
            ]}
          >
            <Text style={[styles.label, { color: active ? colors.onPrimary : colors.text }]}>{item.label}</Text>
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
    gap: Spacing[2],
  },
  fixed: {
    justifyContent: 'space-between',
  },
  tab: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
