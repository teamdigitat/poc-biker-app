import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUITheme, Spacing, Radius } from '../shared';

interface SkeletonLoaderProps {
  variant?: 'text' | 'avatar' | 'card' | 'list';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'text' }) => {
  const { colors } = useUITheme();
  const baseColor = colors.surfaceContainerHigh;

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
    borderRadius: Radius.full,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },
  card: {
    height: 80,
    borderRadius: Radius.md,
  },
  list: {
    gap: Spacing[2],
  },
  row: {
    height: 12,
    width: '100%',
    borderRadius: Radius.full,
  },
});
