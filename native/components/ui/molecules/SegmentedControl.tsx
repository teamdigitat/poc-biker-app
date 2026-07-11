import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface SegmentedControlProps extends BaseComponentProps {
  items: { label: string; value: string; disabled?: boolean }[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, selectedValue, onChange, style }) => {
  const { colors, isDark } = useUITheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F2225' : '#F3F4F6' }, style]}>
      {items.map((item) => {
        const selected = item.value === selectedValue;
        return (
          <Pressable
            key={item.value}
            disabled={item.disabled}
            onPress={() => onChange?.(item.value)}
            style={[
              styles.item,
              selected && { backgroundColor: colors.primary },
              item.disabled && { opacity: 0.5 },
            ]}
          >
            <Text style={[styles.label, { color: selected ? '#FFF' : colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
