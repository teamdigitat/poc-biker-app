import React, { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface TextAreaProps extends BaseComponentProps {
  variant?: 'filled' | 'outline';
  state?: 'default' | 'focused' | 'error' | 'disabled';
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  variant = 'outline',
  state = 'default',
  placeholder,
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
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: state === 'error' ? colors.error : focused ? colors.primary : isDark ? colors.outline : colors.outlineVariant,
          backgroundColor: 'transparent',
        },
        state === 'disabled' && { opacity: 0.6 },
        style,
      ]}
    >
      <RNTextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
        multiline
        numberOfLines={5}
        value={value}
        onChangeText={onChangeText}
        editable={state !== 'disabled'}
        style={[styles.input, { color: colors.text }, textStyle]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
