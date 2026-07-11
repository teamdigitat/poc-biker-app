import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme } from '../shared';

interface ToastProps extends BaseComponentProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
}

export const Toast: React.FC<ToastProps> = ({ variant = 'info', title, children, style }) => {
  const { isDark } = useUITheme();
  const palette = {
    success: { bg: isDark ? '#166534' : '#DCFCE7', icon: 'checkmark-circle-outline', text: isDark ? '#DCFCE7' : '#166534' },
    error: { bg: isDark ? '#991B1B' : '#FEE2E2', icon: 'alert-circle-outline', text: isDark ? '#FEE2E2' : '#991B1B' },
    warning: { bg: isDark ? '#92400E' : '#FEF3C7', icon: 'warning-outline', text: isDark ? '#FEF3C7' : '#92400E' },
    info: { bg: isDark ? '#1D4ED8' : '#DBEAFE', icon: 'information-circle-outline', text: isDark ? '#DBEAFE' : '#1D4ED8' },
  }[variant];

  return (
    <View style={[styles.base, { backgroundColor: palette.bg }, style]}>
      <Ionicons name={palette.icon as keyof typeof Ionicons.glyphMap} size={18} color={palette.text} />
      <View style={styles.content}>
        {title ? <Text style={[styles.title, { color: palette.text }]}>{title}</Text> : null}
        {children ? <Text style={[styles.message, { color: palette.text }]}>{children}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
  },
});
