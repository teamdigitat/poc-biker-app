import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, style, textStyle }) => {
  const { colors } = useUITheme();

  const colorMap = {
    primary: { backgroundColor: colors.primaryContainer, textColor: colors.onPrimaryContainer },
    success: { backgroundColor: colors.tertiaryContainer, textColor: colors.onTertiaryContainer },
    warning: { backgroundColor: colors.secondaryContainer, textColor: colors.onSecondaryContainer },
    error: { backgroundColor: colors.errorContainer, textColor: colors.onErrorContainer },
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
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
