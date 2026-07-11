import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface AppBarProps extends BaseComponentProps {
  variant?: 'simple' | 'back-button' | 'search' | 'large-title';
  title?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({ variant = 'simple', title, leading, trailing, style }) => {
  const { colors } = useUITheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {leading}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {trailing}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
