import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, useUITheme } from '../shared';

interface SearchBarProps extends BaseComponentProps {
  variant?: 'standard' | 'filled';
  state?: 'default' | 'focused' | 'loading';
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'standard',
  state = 'default',
  placeholder = 'Search',
  value,
  onChangeText,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { isDark, colors } = useUITheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.base,
        variant === 'filled' && { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow },
        variant === 'standard' && {
          borderWidth: 1,
          borderColor: focused ? colors.primary : isDark ? colors.outline : colors.outlineVariant,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      <Ionicons name="search-outline" size={18} color={isDark ? '#9BA1A6' : '#687076'} />
      <TextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { color: colors.text }, textStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
});
