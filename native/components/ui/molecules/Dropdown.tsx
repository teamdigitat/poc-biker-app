import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme } from '../shared';

interface DropdownProps extends BaseComponentProps {
  variant?: 'filled' | 'outline';
  state?: 'closed' | 'open' | 'disabled' | 'error';
  selectionMode?: 'single' | 'multi';
  label?: string;
  options?: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  variant = 'outline',
  state = 'closed',
  selectionMode = 'single',
  label = 'Select',
  options = ['Option 1', 'Option 2'],
  style,
}) => {
  const { isDark, colors } = useUITheme();
  const [open, setOpen] = useState(state === 'open');
  const disabled = state === 'disabled';

  return (
    <View style={style}>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen((prev) => !prev)}
        style={[
          styles.base,
          variant === 'filled' && { backgroundColor: isDark ? '#1F2225' : '#F3F4F6' },
          variant === 'outline' && {
            borderWidth: 1,
            borderColor: state === 'error' ? '#DC2626' : isDark ? '#2E3236' : '#D1D5DB',
            backgroundColor: 'transparent',
          },
          disabled && { opacity: 0.55 },
        ]}
      >
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text} />
      </Pressable>
      {open ? (
        <View style={[styles.menu, { backgroundColor: isDark ? '#1F2225' : '#FFFFFF', borderColor: isDark ? '#2E3236' : '#E5E7EB' }]}>
          {options.map((option) => (
            <Text key={option} style={[styles.option, { color: colors.text }]}> {option}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
  },
  menu: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    gap: 6,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
});
