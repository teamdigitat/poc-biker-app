import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, type UISize, type UIState, useUITheme, Radius } from '../shared';

interface IconButtonProps extends BaseComponentProps {
  variant?: 'filled' | 'outline' | 'ghost';
  size?: UISize;
  state?: UIState;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  state = 'default',
  disabled = false,
  iconName = 'add',
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { colors } = useUITheme();
  const resolvedState = disabled || state === 'disabled' ? 'disabled' : state;

  const containerStyle = [
    styles.base,
    styles[size],
    variant === 'filled' && { backgroundColor: colors.primary },
    variant === 'outline' && {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: 'transparent',
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    resolvedState === 'disabled' && { opacity: 0.55 },
    style,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={resolvedState === 'disabled'}
      onPress={onPress}
      style={({ pressed }) => [containerStyle, pressed && resolvedState !== 'disabled' && styles.pressed]}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={size === 'small' ? 16 : size === 'large' ? 22 : 18} color={variant === 'filled' ? colors.onPrimary : colors.primary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 48,
    height: 48,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
