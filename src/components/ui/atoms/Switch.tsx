import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUITheme } from '../shared';

interface SwitchProps {
  state?: 'on' | 'off' | 'disabled';
  onToggle?: () => void;
  accessibilityLabel?: string;
}

export const Switch: React.FC<SwitchProps> = ({ state = 'off', onToggle, accessibilityLabel }) => {
  const { colors } = useUITheme();
  const isOn = state === 'on';
  const disabled = state === 'disabled';

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onToggle}
      style={[styles.track, { backgroundColor: isOn ? colors.primary : colors.outlineVariant }, disabled && { opacity: 0.5 }]}
    >
      <View style={[styles.thumb, { backgroundColor: colors.surface }, isOn && styles.thumbOn]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
});
