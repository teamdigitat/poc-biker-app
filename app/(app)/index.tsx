import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/providers/auth-provider';
import { useCustomTheme } from '@/providers/theme-provider';
import { Badge } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Spacing,
  Radius,
  FontSizes,
  Fonts,
  Elevation,
} from '@/constants/theme';

export default function Index() {
  const { user } = useAuth();
  const { theme, colors } = useCustomTheme();
  const navigation = useNavigation();

  const [showQrOptions, setShowQrOptions] = useState(false);
  const [showBetaPopover, setShowBetaPopover] = useState(false);
  const isDark = theme === 'dark';

  const openNavSidebar = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const quickActions = [
    { label: 'Instant Ride', icon: 'flash-outline' },
    { label: 'Solo Ride', icon: 'person-outline' },
    { label: 'Group Ride', icon: 'people-outline' },
    { label: 'MultiDay Ride', icon: 'calendar-number-outline' },
    { label: 'Add Bike', icon: 'bicycle-outline' },
    { label: 'Add Logs', icon: 'document-text-outline' },
    { label: 'Document Directory', icon: 'folder-open-outline' },
    { label: 'View Events', icon: 'calendar-outline' },
  ];

  const stats = [
    {
      label: 'Total Rides',
      value: '42',
      icon: 'trail-sign-outline',
      color: colors.primary,
    },
    {
      label: 'Distance',
      value: '1,280 km',
      icon: 'map-outline',
      color: colors.success,
    },
    {
      label: 'Riding Hours',
      value: '38h',
      icon: 'time-outline',
      color: colors.accent,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {showBetaPopover && (
        <TouchableOpacity
          style={styles.popoverBackdrop}
          activeOpacity={1}
          onPress={() => setShowBetaPopover(false)}
        >
          <View
            style={[
              styles.popoverContent,
              {
                backgroundColor: colors.inverseSurface,
                borderColor: colors.outlineVariant,
              },
              Elevation.modal,
            ]}
          >
            <Text
              style={[styles.popoverText, { color: colors.inverseOnSurface }]}
            >
              We&apos;re listening, learning and leveling up with every input
            </Text>
            <TouchableOpacity
              onPress={() => setShowBetaPopover(false)}
              style={styles.popoverCloseButton}
            >
              <Ionicons
                name="close"
                size={16}
                color={colors.inverseOnSurface}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <View
        style={[styles.header, { borderBottomColor: colors.outlineVariant }]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[
              styles.menuButton,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
            onPress={openNavSidebar}
          >
            <Ionicons name="menu-outline" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontFamily: Fonts?.display },
            ]}
          >
            Dashboard
          </Text>
          <TouchableOpacity
            onPress={() => setShowBetaPopover((prev) => !prev)}
            style={{ marginLeft: Spacing[2], alignSelf: 'center' }}
          >
            <Badge
              variant="warning"
              style={{ paddingHorizontal: Spacing[2], paddingVertical: 2 }}
            >
              BETA
            </Badge>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
            onPress={() => setShowQrOptions((prev) => !prev)}
          >
            <Ionicons name="qr-code-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
            onPress={() => {}}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {showQrOptions && (
          <View
            style={[
              styles.qrMenu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
              },
              Elevation.modal,
            ]}
          >
            <TouchableOpacity style={styles.qrMenuItem} onPress={() => {}}>
              <Text style={[styles.qrMenuText, { color: colors.text }]}>
                Show My QR Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrMenuItem} onPress={() => {}}>
              <Text style={[styles.qrMenuText, { color: colors.text }]}>
                Scan QR Code
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeRow}>
            <View
              style={[styles.onlineBadge, { backgroundColor: colors.success }]}
            />
            <Text
              style={[styles.welcomeSub, { color: colors.onSurfaceVariant }]}
            >
              Hii {user?.fullName || 'User'}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: Fonts?.display },
          ]}
        >
          Your Ride Summary
        </Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.statIconWrapper,
                  { backgroundColor: `${stat.color}20` },
                ]}
              >
                <Ionicons
                  name={stat.icon as any}
                  size={22}
                  color={stat.color}
                />
              </View>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.text, fontFamily: Fonts?.display },
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.banner,
            { backgroundColor: colors.primary },
            Elevation.card,
          ]}
          activeOpacity={0.9}
        >
          <View style={styles.bannerContent}>
            <Text
              style={[
                styles.bannerTitle,
                { color: colors.onPrimary, fontFamily: Fonts?.display },
              ]}
            >
              Plan Next Ride
            </Text>
            <Text
              style={[
                styles.bannerSubtitle,
                { color: colors.onPrimary, opacity: 0.85 },
              ]}
            >
              Map your route, invite friends and hit the asphalt.
            </Text>
          </View>
          <View style={styles.bannerArrow}>
            <Ionicons name='arrow-forward' size={24} color={colors.onPrimary} />
          </View>
        </TouchableOpacity>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: Fonts?.display },
          ]}
        >
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickActionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outlineVariant,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.surfaceContainerHigh },
                ]}
              >
                <Ionicons
                  name={action.icon as any}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.quickActionLabel,
                  { color: colors.text, fontFamily: Fonts?.sans },
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.garageCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          <View style={styles.garageHeader}>
            <View style={styles.garageTitleWrapper}>
              <Ionicons name='bicycle' size={20} color={colors.primary} />
              <Text
                style={[
                  styles.garageTitle,
                  { color: colors.text, fontFamily: Fonts?.display },
                ]}
              >
                Active Garage
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '700',
                  fontFamily: Fonts?.sans,
                }}
              >
                Manage
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.garageInfo,
              { backgroundColor: colors.surfaceContainer },
            ]}
          >
            <Ionicons
              name='construct-outline'
              size={24}
              color={colors.onSurfaceVariant}
            />
            <View style={styles.garageTextWrapper}>
              <Text
                style={[
                  styles.bikeNickname,
                  { color: colors.text, fontFamily: Fonts?.sans },
                ]}
              >
                KTM Duke 390
              </Text>
              <Text
                style={[styles.bikeModel, { color: colors.onSurfaceVariant }]}
              >
                MH-12-RS-2024 • Odo: 5,420 km
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  scrollContainer: {
    padding: Spacing[6],
    gap: Spacing[6],
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  welcomeSection: {
    marginTop: Spacing[2],
  },
  welcomeSub: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    marginBottom: Spacing[1],
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginBottom: -Spacing[2],
  },
  popoverBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  popoverContent: {
    position: 'absolute',
    top: 60,
    left: Spacing[6],
    right: Spacing[6],
    borderRadius: Radius.md,
    padding: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    zIndex: 25,
  },
  popoverText: {
    flex: 1,
    fontSize: FontSizes.xs,
    lineHeight: 18,
    fontWeight: '500',
    marginRight: Spacing[2],
  },
  popoverCloseButton: {
    padding: Spacing[1],
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing[3],
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 90,
    borderRadius: Radius.md,
    padding: Spacing[4],
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  banner: {
    borderRadius: Radius.lg,
    padding: Spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
    paddingRight: Spacing[4],
  },
  bannerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  bannerSubtitle: {
    fontSize: FontSizes.xs,
    lineHeight: 18,
  },
  bannerArrow: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  garageCard: {
    borderRadius: Radius.lg,
    padding: Spacing[6],
    borderWidth: 1,
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  garageTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  garageTitle: {
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  garageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: Radius.md,
    gap: Spacing[4],
  },
  garageTextWrapper: {
    flex: 1,
  },
  bikeNickname: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  bikeModel: {
    fontSize: FontSizes.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrMenu: {
    position: 'absolute',
    top: 58,
    right: 0,
    width: 172,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing[2],
    zIndex: 10,
  },
  qrMenuItem: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  qrMenuText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  quickActionCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing[4],
    justifyContent: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 88,
    left: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: Spacing[6],
    zIndex: 9,
  },
  quickActionsPanel: {
    width: 220,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.md,
    marginBottom: Spacing[2],
  },
  quickActionText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  quickActionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: Spacing[2],
  },
});
