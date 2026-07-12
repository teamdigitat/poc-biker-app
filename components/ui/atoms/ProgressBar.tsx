import React from "react";
import { StyleSheet, View } from "react-native";
import { useUITheme } from "../shared";

interface ProgressBarProps {
  variant?: "linear" | "circular";
  state?: "determinate" | "indeterminate";
  progress?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  variant = "linear",
  state = "determinate",
  progress = 0.5,
}) => {
  const { colors } = useUITheme();

  if (variant === "circular") {
    return (
      <View style={styles.circularBase}>
        <View
          style={[styles.circularTrack, { borderColor: colors.outlineVariant }]}
        >
          <View
            style={[
              styles.circularFill,
              {
                borderColor: colors.primary,
                transform: [{ rotate: `${(progress * 360) / 2}deg` }],
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.linearTrack, { backgroundColor: colors.outlineVariant }]}
    >
      <View
        style={[
          styles.linearFill,
          {
            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
            backgroundColor: colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  linearTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  linearFill: {
    height: "100%",
    borderRadius: 999,
  },
  circularBase: {
    alignItems: "center",
    justifyContent: "center",
  },
  circularTrack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
  },
  circularFill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
});
