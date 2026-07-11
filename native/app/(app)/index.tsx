import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { useDrawer } from './_layout';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme, colors } = useCustomTheme();
  const { openDrawer } = useDrawer();

  const isDark = theme === 'dark';

  // Sample data for premium looks
  const stats = [
    { label: 'Total Rides', value: '42', icon: 'trail-sign-outline', color: colors.tint },
    { label: 'Distance', value: '1,280 km', icon: 'map-outline', color: '#10B981' },
    { label: 'Riding Hours', value: '38h', icon: 'time-outline', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#2E3236' : '#E1E4E6' }]}>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]} onPress={openDrawer}>
          <Ionicons name="menu-outline" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeSub, { color: isDark ? '#9BA1A6' : '#687076' }]}>Hello Rider,</Text>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome, {user?.fullName || 'User'}!
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Ride Summary</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
                  borderColor: isDark ? '#2E3236' : '#E1E4E6'
                }
              ]}
            >
              <View style={[styles.statIconWrapper, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Next Ride Banner */}
        <TouchableOpacity 
          style={[styles.banner, { backgroundColor: colors.tint }]}
          activeOpacity={0.9}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Plan Next Ride</Text>
            <Text style={styles.bannerSubtitle}>Map your route, invite friends and hit the asphalt.</Text>
          </View>
          <View style={styles.bannerArrow}>
            <Ionicons name="arrow-forward" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Garage Status Card */}
        <View 
          style={[
            styles.garageCard, 
            { 
              backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
              borderColor: isDark ? '#2E3236' : '#E1E4E6'
            }
          ]}
        >
          <View style={styles.garageHeader}>
            <View style={styles.garageTitleWrapper}>
              <Ionicons name="bicycle" size={20} color={colors.tint} />
              <Text style={[styles.garageTitle, { color: colors.text }]}>Active Garage</Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: colors.tint, fontWeight: '700' }}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.garageInfo, { backgroundColor: isDark ? '#151718' : '#FFF' }]}>
            <Ionicons name="construct-outline" size={24} color={isDark ? '#9BA1A6' : '#687076'} />
            <View style={styles.garageTextWrapper}>
              <Text style={[styles.bikeNickname, { color: colors.text }]}>KTM Duke 390</Text>
              <Text style={[styles.bikeModel, { color: isDark ? '#9BA1A6' : '#687076' }]}>MH-12-RS-2024 • Odo: 5,420 km</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 42,
  },
  scrollContainer: {
    padding: 24,
    gap: 24,
  },
  welcomeSection: {
    marginTop: 8,
  },
  welcomeSub: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: -8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 90,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  bannerArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  garageCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  garageTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  garageTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  garageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  garageTextWrapper: {
    flex: 1,
  },
  bikeNickname: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  bikeModel: {
    fontSize: 12,
  },
});
