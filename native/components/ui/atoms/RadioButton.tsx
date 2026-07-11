import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUITheme } from '../shared';

interface RadioButtonProps {
  state?: 'selected' | 'unselected' | 'disabled';
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ state = 'unselected', onPress, accessibilityLabel }) => {
  const { colors } = useUITheme();
  const isDisabled = state === 'disabled';
  const selected = state === 'selected';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, selected && { borderColor: colors.primary }, isDisabled && { opacity: 0.5 }]}
    >
      {selected ? <View style={[styles.inner, { backgroundColor: colors.primary }]} /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#907067',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
