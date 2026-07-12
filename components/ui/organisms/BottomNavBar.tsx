import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Radius, Spacing } from "../../../constants/theme";

interface BottomNavBarProps {
  bottomNavItems: { icon: string; active: boolean }[];
  isDark: boolean;
  colors: any; // TODO: narrow this type — should be ThemeColors
  isQuickActionsOpen: boolean;
  onQuickActionsPress: () => void;
}

export function BottomNavBar({
  bottomNavItems,
  isDark,
  colors,
  isQuickActionsOpen,
  onQuickActionsPress,
}: BottomNavBarProps) {
  return (
    <View
      style={[
        styles.bottomNavWrapper,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
        },
      ]}
    >
      <View
        style={[
          styles.bottomNavPill,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.bottomNavButton,
              item.active && { backgroundColor: colors.primary },
            ]}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.active ? colors.onPrimary : colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.bottomNavClose,
          { backgroundColor: colors.surfaceContainer },
        ]}
        onPress={onQuickActionsPress}
      >
        <Ionicons
          name={isQuickActionsOpen ? "close" : "flash-outline"}
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    width: "100%",
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
  },
  bottomNavPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    padding: Spacing[3],
    gap: Spacing[3],
  },
  bottomNavButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavButtonActive: {
    // Styles applied dynamically via inline style
  },
  bottomNavClose: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
});
