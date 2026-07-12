import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type BaseComponentProps, useUITheme, Spacing, FontSizes, Fonts } from '../shared';

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
      <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.display }]}>{title}</Text>
      {trailing}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
});
