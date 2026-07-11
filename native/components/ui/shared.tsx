import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useCustomTheme } from '../theme-context';

export type UIState =
  | 'default'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'focused'
  | 'filled'
  | 'checked'
  | 'unchecked'
  | 'indeterminate'
  | 'selected'
  | 'unselected'
  | 'on'
  | 'off'
  | 'open'
  | 'closed'
  | 'expanded'
  | 'collapsed'
  | 'active'
  | 'inactive'
  | 'error'
  | 'readonly';

export type UISize = 'small' | 'medium' | 'large';
export type UIVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'danger' | 'filled' | 'elevated' | 'outlined' | 'center' | 'bottom-sheet' | 'full-screen' | 'success' | 'warning' | 'info' | 'neutral' | 'image' | 'initials' | 'icon' | 'horizontal' | 'vertical';

export interface BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export const useUITheme = () => {
  const { theme, colors } = useCustomTheme();
  return { theme, isDark: theme === 'dark', colors };
};

export const getSizeValue = (size: UISize) => {
  switch (size) {
    case 'small':
      return 32;
    case 'large':
      return 48;
    default:
      return 40;
  }
};

export const getPaddingForSize = (size: UISize) => {
  switch (size) {
    case 'small':
      return 10;
    case 'large':
      return 16;
    default:
      return 12;
  }
};
