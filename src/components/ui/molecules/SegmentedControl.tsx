import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme, Spacing, Radius } from '../shared';

interface SegmentedControlProps extends BaseComponentProps {
  items: { label: string; value: string; disabled?: boolean }[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, selectedValue, onChange, style }) => {
  const { colors } = useUITheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainer }, style]}>
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
            <Text style={[styles.label, { color: selected ? colors.onPrimary : colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: Spacing[1],
    gap: Spacing[1],
  },
  item: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: Spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
