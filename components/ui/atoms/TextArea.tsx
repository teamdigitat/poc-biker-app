import React, { useState } from "react";
import { StyleSheet, TextInput as RNTextInput, View } from "react-native";
import {
  type BaseComponentProps,
  useUITheme,
  Radius,
  Spacing,
  FontSizes,
  Fonts,
} from "../shared";

interface TextAreaProps extends BaseComponentProps {
  variant?: "filled" | "outline";
  state?: "default" | "focused" | "error" | "disabled";
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  variant = "outline",
  state = "default",
  placeholder,
  value,
  onChangeText,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colors } = useUITheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.base,
        variant === "filled" && { backgroundColor: colors.surfaceContainer },
        variant === "outline" && {
          borderWidth: 1,
          borderColor:
            state === "error"
              ? colors.danger
              : focused
                ? colors.primary
                : colors.outline,
          backgroundColor: "transparent",
        },
        state === "disabled" && { opacity: 0.6 },
        style,
      ]}
    >
      <RNTextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceMuted}
        multiline
        numberOfLines={5}
        value={value}
        onChangeText={onChangeText}
        editable={state !== "disabled"}
        style={[
          styles.input,
          { color: colors.text, fontFamily: Fonts?.sans },
          textStyle,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    minHeight: 120,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
  },
  input: {
    flex: 1,
    minHeight: 100,
    fontSize: FontSizes.base,
    textAlignVertical: "top",
  },
});
