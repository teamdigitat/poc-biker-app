import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  state?: 'default' | 'pressed';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  state = 'default',
  onPress,
  children,
  style,
  contentStyle,
}) => {
  const { isDark, colors } = useUITheme();

  const containerStyle = [
    styles.base,
    variant === 'elevated' && {
      backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLowest,
      shadowColor: colors.onSurface,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    variant === 'outlined' && {
      backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    variant === 'filled' && {
      backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
    },
    state === 'pressed' && { opacity: 0.9 },
    style,
  ];

  const body = <View style={[styles.content, contentStyle]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [containerStyle, pressed && styles.pressed]}>
        {body}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{body}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  content: {
    padding: 16,
  },
});
