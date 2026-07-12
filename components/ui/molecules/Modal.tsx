import React from "react";
import { Modal as RNModal, Pressable, StyleSheet, View } from "react-native";
import {
  type BaseComponentProps,
  useUITheme,
  Spacing,
  Radius,
} from "../shared";

interface ModalProps extends BaseComponentProps {
  variant?: "center" | "bottom-sheet" | "full-screen";
  state?: "open" | "closed";
  visible?: boolean;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  variant = "center",
  state = "closed",
  visible = false,
  onClose,
  children,
  style,
}) => {
  const { colors } = useUITheme();

  return (
    <RNModal
      visible={visible || state === "open"}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.background + "66" }]}
        onPress={onClose}
      />
      <View
        style={[
          styles.container,
          variant === "center" && styles.center,
          variant === "bottom-sheet" && styles.bottomSheet,
          variant === "full-screen" && styles.fullScreen,
          { backgroundColor: colors.background },
          style,
        ]}
      >
        {children}
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    padding: Spacing[6],
  },
  bottomSheet: {
    justifyContent: "flex-end",
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing[4],
  },
  fullScreen: {
    padding: Spacing[4],
  },
});
