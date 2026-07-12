import React from 'react';
import { StyleSheet, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface DividerProps extends BaseComponentProps {
  variant?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({ variant = 'horizontal', style }) => {
  const { isDark, colors } = useUITheme();

  return (
    <View 
      style={[
        variant === 'vertical' ? styles.vertical : styles.horizontal, 
        { backgroundColor: isDark ? colors.outline : colors.outlineVariant },
        style
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
