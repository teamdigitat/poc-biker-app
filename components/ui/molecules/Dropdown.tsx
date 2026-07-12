import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme, Spacing, Radius } from '../shared';

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
  const { colors } = useUITheme();
  const [open, setOpen] = useState(state === 'open');
  const disabled = state === 'disabled';

  return (
    <View style={style}>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen((prev) => !prev)}
        style={[
          styles.base,
          variant === 'filled' && { backgroundColor: colors.surfaceContainer },
          variant === 'outline' && {
            borderWidth: 1,
            borderColor: state === 'error' ? colors.danger : colors.outline,
            backgroundColor: 'transparent',
          },
          disabled && { opacity: 0.55 },
        ]}
      >
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text} />
      </Pressable>
      {open ? (
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
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
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
  },
  label: {
    fontSize: 14,
  },
  menu: {
    marginTop: Spacing[1],
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing[2],
    gap: Spacing[1],
  },
  option: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[1],
  },
});
