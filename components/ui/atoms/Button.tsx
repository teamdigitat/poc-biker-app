import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  type BaseComponentProps,
  type UISize,
  type UIState,
  useUITheme,
  Spacing,
  Radius,
  FontSizes,
  Fonts,
} from "../shared";

interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "text" | "danger";
  size?: UISize;
  state?: UIState;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  state = "default",
  disabled = false,
  loading = false,
  onPress,
  leftIcon,
  rightIcon,
  children,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colors } = useUITheme();
  const resolvedState =
    disabled || state === "disabled" ? "disabled" : loading ? "loading" : state;

  const containerStyle = [
    styles.base,
    styles[size],
    variant === "primary" && { backgroundColor: colors.primary },
    variant === "secondary" && { backgroundColor: colors.secondaryContainer },
    variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    variant === "ghost" && {
      backgroundColor: "transparent",
    },
    variant === "text" && {
      backgroundColor: "transparent",
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    variant === "danger" && { backgroundColor: colors.danger },
    resolvedState === "disabled" && { opacity: 0.55 },
    style,
  ];

  const labelColor =
    variant === "outline" || variant === "ghost" || variant === "text"
      ? colors.primary
      : variant === "danger"
        ? colors.onDanger
        : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={resolvedState === "disabled"}
      onPress={onPress}
      style={({ pressed }) => [
        containerStyle,
        pressed && resolvedState !== "disabled" && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          {children ? (
            <Text style={[styles.label, { color: labelColor }, textStyle]}>
              {children}
            </Text>
          ) : null}
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  small: {
    minHeight: 32,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  medium: {
    minHeight: 40,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  large: {
    minHeight: 48,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  label: {
    fontWeight: "600",
    fontFamily: Fonts?.sans,
    fontSize: FontSizes.base,
  },
});
