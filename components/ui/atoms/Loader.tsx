import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useUITheme } from "../shared";

interface LoaderProps {
  variant?: "circular" | "linear" | "full-screen";
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = "circular",
  label,
}) => {
  const { colors } = useUITheme();

  if (variant === "full-screen") {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={colors.tint} />
        {label ? (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator
        size={variant === "linear" ? "small" : "large"}
        color={colors.tint}
      />
      {label ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
});
