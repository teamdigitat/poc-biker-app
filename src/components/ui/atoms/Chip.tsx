import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { type BaseComponentProps, useUITheme, Radius, Spacing, FontSizes, Fonts } from '../shared';

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
  const { colors } = useUITheme();
  const selected = state === 'selected';
  const disabled = state === 'disabled';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'filled' && { backgroundColor: selected ? colors.primary : colors.surfaceContainerHigh },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.outline,
          backgroundColor: 'transparent',
        },
        disabled && { opacity: 0.55 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: selected ? colors.onPrimary : colors.text }, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
