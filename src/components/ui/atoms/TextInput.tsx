import React, { useState, forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type BaseComponentProps, type UISize, useUITheme, Radius, Spacing, FontSizes, Fonts } from '../shared';

interface TextInputProps extends Omit<RNTextInputProps, 'size' | 'style'>, BaseComponentProps {
  variant?: 'filled' | 'outline';
  type?: 'text' | 'password' | 'email' | 'number';
  size?: UISize;
  state?: 'default' | 'focused' | 'filled' | 'error' | 'disabled' | 'readonly';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(({
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
  ...rest
}, ref) => {
  const { colors } = useUITheme();
  const [focused, setFocused] = useState(false);
  const resolvedState = state === 'focused' ? 'focused' : state;
  const isDisabled = resolvedState === 'disabled' || resolvedState === 'readonly';

  const containerStyle = [
    styles.base,
    styles[size],
    variant === 'filled' && { backgroundColor: colors.surfaceContainer },
    variant === 'outline' && {
      borderWidth: 1.5,
      borderColor: resolvedState === 'error' ? colors.danger : focused ? colors.primary : colors.outline,
      backgroundColor: 'transparent',
    },
    resolvedState === 'error' && { borderColor: colors.danger },
    isDisabled && { opacity: 0.6 },
    style,
  ];

  return (
    <View style={containerStyle}>
      {leftIcon ? <Ionicons name={leftIcon} size={18} color={focused ? colors.primary : colors.onSurfaceVariant} /> : null}
      <RNTextInput
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceMuted}
        value={value}
        onChangeText={onChangeText}
        editable={!isDisabled}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : rest.keyboardType ?? 'default'}
        autoCapitalize={type === 'email' ? 'none' : rest.autoCapitalize ?? 'sentences'}
        style={[styles.input, { color: colors.text }, textStyle]}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      {rightIcon ? (
        <Pressable onPress={onRightIconPress} style={styles.rightIconWrapper}>
          <Ionicons name={rightIcon} size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      ) : null}
    </View>
  );
});

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.sm,
    gap: Spacing[2],
  },
  small: {
    minHeight: 36,
    paddingHorizontal: Spacing[3],
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: Spacing[3],
  },
  large: {
    minHeight: 54, // Updated to 54 for outdoor/motorsport use
    paddingHorizontal: Spacing[4],
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    fontFamily: Fonts?.sans,
    paddingVertical: 0,
    height: '100%',
  },
  rightIconWrapper: {
    padding: Spacing[1],
  },
});
