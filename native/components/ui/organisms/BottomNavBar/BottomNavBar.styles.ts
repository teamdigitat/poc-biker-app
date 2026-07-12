import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomNavWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  bottomNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 10,
    gap: 10,
  },
  bottomNavButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavButtonActive: {
    backgroundColor: '#EF4444',
  },
  bottomNavClose: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
