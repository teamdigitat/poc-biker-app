import React from "react";
import { StyleSheet, View } from "react-native";
import {
  type BaseComponentProps,
  useUITheme,
  Spacing,
  Radius,
} from "../shared";

interface BottomSheetProps extends BaseComponentProps {
  variant?: "small" | "medium" | "large" | "full";
  state?: "expanded" | "collapsed";
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  variant = "medium",
  state = "collapsed",
  children,
  style,
}) => {
  const { colors } = useUITheme();

  const heightMap = {
    small: "30%",
    medium: "50%",
    large: "75%",
    full: "100%",
  } as const;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.background, height: heightMap[variant] },
        state === "collapsed" && { opacity: 0.95 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing[4],
  },
});
