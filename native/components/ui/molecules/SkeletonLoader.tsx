import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUITheme } from '../shared';

interface SkeletonLoaderProps {
  variant?: 'text' | 'avatar' | 'card' | 'list';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'text' }) => {
  const { isDark } = useUITheme();
  const baseColor = isDark ? '#2E3236' : '#E5E7EB';

  if (variant === 'avatar') {
    return <View style={[styles.avatar, { backgroundColor: baseColor }]} />;
  }

  if (variant === 'card') {
    return <View style={[styles.card, { backgroundColor: baseColor }]} />;
  }

  if (variant === 'list') {
    return (
      <View style={styles.list}>
        <View style={[styles.row, { backgroundColor: baseColor }]} />
        <View style={[styles.row, { backgroundColor: baseColor }]} />
      </View>
    );
  }

  return <View style={[styles.text, { backgroundColor: baseColor }]} />;
};

const styles = StyleSheet.create({
  text: {
    height: 12,
    width: '60%',
    borderRadius: 999,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  card: {
    height: 80,
    borderRadius: 16,
  },
  list: {
    gap: 8,
  },
  row: {
    height: 12,
    width: '100%',
    borderRadius: 999,
  },
});
