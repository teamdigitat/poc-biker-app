import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme } from '../shared';

interface CheckboxProps extends BaseComponentProps {
  state?: 'checked' | 'unchecked' | 'indeterminate' | 'disabled';
  onPress?: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ state = 'unchecked', onPress, style, accessibilityLabel }) => {
  const { colors } = useUITheme();
  const isDisabled = state === 'disabled';
  const checked = state === 'checked' || state === 'indeterminate';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, checked && { backgroundColor: colors.primary, borderColor: colors.primary }, isDisabled && { opacity: 0.5 }, style]}
    >
      {checked ? <Ionicons name={state === 'indeterminate' ? 'remove' : 'checkmark'} size={14} color="#FFF" /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#907067',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
