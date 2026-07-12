import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  type BaseComponentProps,
  useUITheme,
  Spacing,
  Radius,
} from "../shared";

interface ToastProps extends BaseComponentProps {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variant = "info",
  title,
  children,
  style,
}) => {
  const { colors } = useUITheme();

  const palette = {
    success: {
      bg: colors.accentContainer,
      icon: "checkmark-circle-outline",
      text: colors.onAccentContainer,
    },
    error: {
      bg: colors.dangerContainer,
      icon: "alert-circle-outline",
      text: colors.onDangerContainer,
    },
    warning: {
      bg: colors.accentContainer,
      icon: "warning-outline",
      text: colors.onAccentContainer,
    },
    info: {
      bg: colors.surfaceContainerHigh,
      icon: "information-circle-outline",
      text: colors.onSurface,
    },
  }[variant];

  return (
    <View style={[styles.base, { backgroundColor: palette.bg }, style]}>
      <Ionicons
        name={palette.icon as keyof typeof Ionicons.glyphMap}
        size={18}
        color={palette.text}
      />
      <View style={styles.content}>
        {title ? (
          <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        ) : null}
        {children ? (
          <Text style={[styles.message, { color: palette.text }]}>
            {children}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: Radius.md,
    padding: Spacing[3],
    gap: Spacing[2],
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: "700",
  },
  message: {
    fontSize: 13,
  },
});
