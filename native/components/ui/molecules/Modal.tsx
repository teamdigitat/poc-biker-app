import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import { type BaseComponentProps, useUITheme } from '../shared';

interface ModalProps extends BaseComponentProps {
  variant?: 'center' | 'bottom-sheet' | 'full-screen';
  state?: 'open' | 'closed';
  visible?: boolean;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ variant = 'center', state = 'closed', visible = false, onClose, children, style }) => {
  const { colors } = useUITheme();

  return (
    <RNModal visible={visible || state === 'open'} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.surfaceVariant + '66' }]} onPress={onClose} />
      <View style={[
        styles.container,
        variant === 'center' && styles.center,
        variant === 'bottom-sheet' && styles.bottomSheet,
        variant === 'full-screen' && styles.fullScreen,
        { backgroundColor: colors.background },
        style,
      ]}>
        {children}
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    padding: 24,
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  fullScreen: {
    padding: 20,
  },
});
