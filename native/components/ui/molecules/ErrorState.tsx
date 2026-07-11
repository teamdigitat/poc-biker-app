import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUITheme } from '../shared';

interface ErrorStateProps {
  variant?: 'network-error' | 'server-error' | 'generic-error';
  title?: string;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ variant = 'generic-error', title, message }) => {
  const { colors } = useUITheme();
  const iconMap = {
    'network-error': 'wifi-outline',
    'server-error': 'server-outline',
    'generic-error': 'warning-outline',
  } as const;

  return (
    <View style={styles.container}>
      <Ionicons name={iconMap[variant]} size={28} color="#DC2626" />
      <Text style={[styles.title, { color: colors.text }]}>{title ?? 'Something went wrong'}</Text>
      <Text style={[styles.message, { color: colors.icon }]}>{message ?? 'Please try again.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
  },
});
