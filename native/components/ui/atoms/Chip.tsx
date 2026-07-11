import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface ChipProps extends BaseComponentProps {
  variant?: 'filled' | 'outline';
  type?: 'action' | 'choice' | 'filter';
  state?: 'selected' | 'unselected' | 'disabled';
  onPress?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'filled',
  type = 'choice',
  state = 'unselected',
  onPress,
  children,
  style,
  textStyle,
}) => {
  const { isDark, colors } = useUITheme();
  const selected = state === 'selected';
  const disabled = state === 'disabled';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'filled' && { backgroundColor: selected ? colors.primary : isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLow },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: selected ? colors.primary : isDark ? colors.outline : colors.outlineVariant,
          backgroundColor: 'transparent',
        },
        disabled && { opacity: 0.55 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: selected ? '#FFF' : colors.text }, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
