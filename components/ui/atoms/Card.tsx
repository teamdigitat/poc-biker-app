import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  type BaseComponentProps,
  useUITheme,
  Spacing,
  Radius,
  Elevation,
} from "../shared";

interface CardProps extends BaseComponentProps {
  variant?: "elevated" | "outlined" | "filled";
  state?: "default" | "pressed";
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  state = "default",
  onPress,
  children,
  style,
  contentStyle,
}) => {
  const { isDark, colors } = useUITheme();

  const containerStyle = [
    styles.base,
    variant === "elevated" && {
      backgroundColor: isDark ? colors.surfaceContainer : colors.surface,
      ...Elevation.card,
    },
    variant === "outlined" && {
      backgroundColor: isDark ? colors.surfaceContainer : colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    variant === "filled" && {
      backgroundColor: isDark
        ? colors.surfaceContainerHigh
        : colors.surfaceContainer,
    },
    state === "pressed" && { opacity: 0.9 },
    style,
  ];

  const body = <View style={[styles.content, contentStyle]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{body}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  content: {
    padding: Spacing[4],
  },
});
