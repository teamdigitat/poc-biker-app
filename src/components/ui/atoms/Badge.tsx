import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme, Radius, Spacing, FontSizes, Fonts } from '../shared';

interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, style, textStyle }) => {
  const { colors } = useUITheme();

  const colorMap = {
    primary: { backgroundColor: colors.primaryContainer, textColor: colors.onPrimaryContainer },
    success: { backgroundColor: colors.accentContainer, textColor: colors.onAccentContainer },
    warning: { backgroundColor: colors.accentContainer, textColor: colors.onAccentContainer },
    error: { backgroundColor: colors.dangerContainer, textColor: colors.onDangerContainer },
    neutral: { backgroundColor: colors.surfaceContainerHigh, textColor: colors.onSurfaceVariant },
  } as const;

  const palette = colorMap[variant];

  return (
    <View style={[styles.base, { backgroundColor: palette.backgroundColor }, style]}>
      <Text style={[styles.label, { color: palette.textColor }, textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    fontFamily: Fonts?.sans,
  },
});
