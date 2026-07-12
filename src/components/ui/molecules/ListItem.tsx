import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme, Spacing } from '../shared';

interface ListItemProps extends BaseComponentProps {
  variant?: 'default' | 'with-icon' | 'with-avatar' | 'with-switch' | 'with-checkbox';
  state?: 'default' | 'pressed' | 'disabled';
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  trailing?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  variant = 'default',
  state = 'default',
  title,
  subtitle,
  iconName,
  trailing,
  children,
  style,
}) => {
  const { colors } = useUITheme();
  const disabled = state === 'disabled';

  return (
    <Pressable disabled={disabled} style={[styles.base, disabled && { opacity: 0.55 }, style]}>
      {variant === 'with-icon' && iconName ? <Ionicons name={iconName} size={20} color={colors.text} /> : null}
      <View style={styles.content}>
        {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
        {subtitle ? <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>{subtitle}</Text> : null}
        {children}
      </View>
      {trailing}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
});
