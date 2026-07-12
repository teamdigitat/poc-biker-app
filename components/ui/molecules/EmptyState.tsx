import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUITheme } from "../shared";

interface EmptyStateProps {
  variant?: "no-data" | "no-search-results" | "offline";
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = "no-data",
  title,
  message,
}) => {
  const { colors } = useUITheme();
  const iconMap = {
    "no-data": "folder-open-outline",
    "no-search-results": "search-outline",
    offline: "cloud-offline-outline",
  } as const;

  return (
    <View style={styles.container}>
      <Ionicons name={iconMap[variant]} size={28} color={colors.icon} />
      <Text style={[styles.title, { color: colors.text }]}>
        {title ?? "Nothing here yet"}
      </Text>
      <Text style={[styles.message, { color: colors.icon }]}>
        {message ?? "Try again later."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  message: {
    fontSize: 13,
    textAlign: "center",
  },
});
