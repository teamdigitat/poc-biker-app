import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  type BaseComponentProps,
  useUITheme,
  Radius,
  Spacing,
  FontSizes,
  Fonts,
} from "../shared";

interface SearchBarProps extends BaseComponentProps {
  variant?: "standard" | "filled";
  state?: "default" | "focused" | "loading";
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = "standard",
  state = "default",
  placeholder = "Search",
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
        variant === "standard" && {
          borderWidth: 1,
          borderColor: focused ? colors.primary : colors.outline,
          backgroundColor: "transparent",
        },
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={18}
        color={colors.onSurfaceVariant}
      />
      <TextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          { color: colors.text, fontFamily: Fonts?.sans },
          textStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    paddingVertical: 0,
  },
});
