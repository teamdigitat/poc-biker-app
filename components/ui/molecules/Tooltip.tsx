import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUITheme } from "../shared";

interface TooltipProps {
  variant?: "top" | "bottom" | "left" | "right";
  label?: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  variant = "top",
  label = "Tooltip",
  children,
}) => {
  const { colors } = useUITheme();

  return (
    <View style={styles.container}>
      {children}
      <View style={[styles.bubble, { backgroundColor: colors.text }]}>
        <Text style={[styles.label, { color: colors.background }]}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
