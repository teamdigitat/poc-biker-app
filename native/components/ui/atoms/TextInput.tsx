import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput as RNTextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, type UISize, useUITheme } from '../shared';

interface TextInputProps extends BaseComponentProps {
  variant?: 'filled' | 'outline';
  type?: 'text' | 'password' | 'email' | 'number';
  size?: UISize;
  state?: 'default' | 'focused' | 'filled' | 'error' | 'disabled' | 'readonly';
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  variant = 'outline',
  type = 'text',
  size = 'medium',
  state = 'default',
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { isDark, colors } = useUITheme();
  const [focused, setFocused] = useState(false);
  const resolvedState = state === 'focused' ? 'focused' : state;
  const isDisabled = resolvedState === 'disabled' || resolvedState === 'readonly';

  const containerStyle = [
    styles.base,
    styles[size],
    variant === 'filled' && { backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow },
    variant === 'outline' && {
      borderWidth: 1,
      borderColor: resolvedState === 'error' ? colors.error : focused ? colors.primary : isDark ? colors.outline : colors.outlineVariant,
      backgroundColor: 'transparent',
    },
    resolvedState === 'error' && { borderColor: '#DC2626' },
    isDisabled && { opacity: 0.6 },
    style,
  ];

  return (
    <View style={containerStyle}>
      {leftIcon ? <Ionicons name={leftIcon} size={18} color={isDark ? '#9BA1A6' : '#687076'} /> : null}
      <RNTextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
        value={value}
        onChangeText={onChangeText}
        editable={!isDisabled}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        style={[styles.input, { color: colors.text }, textStyle]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {rightIcon ? (
        <Pressable onPress={onRightIconPress}>
          <Ionicons name={rightIcon} size={18} color={isDark ? '#9BA1A6' : '#687076'} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: 8,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 10,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 12,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
});
