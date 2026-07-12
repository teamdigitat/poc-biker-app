import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type BaseComponentProps, useUITheme } from "../shared";

interface AvatarProps extends BaseComponentProps {
  variant?: "image" | "initials" | "icon";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  initials?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const Avatar: React.FC<AvatarProps> = ({
  variant = "initials",
  size = "md",
  src,
  initials = "AB",
  iconName = "person",
  style,
}) => {
  const { colors } = useUITheme();
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  } as const;

  const dimension = sizeMap[size];

  return (
    <View
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: colors.surfaceContainerHigh,
        },
        style,
      ]}
    >
      {variant === "image" && src ? (
        <Image source={{ uri: src }} style={styles.image} />
      ) : null}
      {variant === "initials" ? (
        <Text style={[styles.initials, { color: colors.text }]}>
          {initials}
        </Text>
      ) : null}
      {variant === "icon" ? (
        <Ionicons name={iconName} size={dimension * 0.45} color={colors.text} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontWeight: "700",
    fontSize: 14,
  },
});
