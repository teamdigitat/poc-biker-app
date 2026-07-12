import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/src/providers/auth-provider';
import { useCustomTheme } from '@/src/providers/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Spacing,
  Radius,
  FontSizes,
  Fonts,
  Elevation,
} from '@/src/constants/theme';
import { Button } from '@/src/components/ui';
import { apiClient } from '@/src/lib/api-client';

interface Device {
  id: string;
  platform: string;
  deviceModel?: string;
  appVersion?: string;
  lastActiveAt: string;
  createdAt: string;
}

interface Session {
  id: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  device?: Device;
}

export default function DevicesScreen() {
  const { token } = useAuth();
  const { theme, colors } = useCustomTheme();
  const [devices, setDevices] = useState<Device[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      const response = await apiClient.get('/auth/devices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await apiClient.get('/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchDevices(), fetchSessions()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRevokeDevice = async (deviceId: string) => {
    Alert.alert(
      'Revoke Device',
      'Are you sure you want to revoke this device? This will log out the device and remove its access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.post(
                '/auth/revoke-device',
                { deviceId },
                { headers: { Authorization: `Bearer ${token}` } },
              );
              Alert.alert('Success', 'Device revoked successfully');
              await loadData();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to revoke device',
              );
            }
          },
        },
      ],
    );
  };

  const handleLogoutAll = async () => {
    Alert.alert(
      'Logout All Devices',
      'Are you sure you want to logout from all devices? You will need to login again on each device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.post('/auth/logout-all', null, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Success', 'Logged out from all devices');
              await loadData();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to logout all devices',
              );
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ios':
        return 'logo-apple';
      case 'android':
        return 'logo-android';
      case 'web':
        return 'globe';
      default:
        return 'phone-portrait';
    }
  };

  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: Fonts?.display },
          ]}
        >
          Devices & Sessions
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans },
          ]}
        >
          Manage your active devices and sessions
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <Text
              style={[styles.loadingText, { color: colors.onSurfaceVariant }]}
            >
              Loading devices...
            </Text>
          </View>
        ) : (
          <>
            {/* Devices Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontFamily: Fonts?.sans },
                ]}
              >
                Active Devices ({devices.length})
              </Text>

              {devices.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    { backgroundColor: colors.surfaceContainer },
                  ]}
                >
                  <Ionicons
                    name='phone-portrait-outline'
                    size={48}
                    color={colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.emptyText,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    No active devices
                  </Text>
                </View>
              ) : (
                devices.map((device) => (
                  <View
                    key={device.id}
                    style={[
                      styles.deviceCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.outline,
                      },
                    ]}
                  >
                    <View style={styles.deviceInfo}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.primaryContainer },
                        ]}
                      >
                        <Ionicons
                          name={getPlatformIcon(device.platform)}
                          size={24}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.deviceDetails}>
                        <Text
                          style={[
                            styles.deviceName,
                            { color: colors.text, fontFamily: Fonts?.sans },
                          ]}
                        >
                          {device.deviceModel || 'Unknown Device'}
                        </Text>
                        <Text
                          style={[
                            styles.deviceMeta,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          {device.platform} •{' '}
                          {device.appVersion || 'Unknown Version'}
                        </Text>
                        <Text
                          style={[
                            styles.deviceMeta,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          Last active: {formatDate(device.lastActiveAt)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.revokeButton,
                        { backgroundColor: colors.surfaceContainerHighest },
                      ]}
                      onPress={() => handleRevokeDevice(device.id)}
                    >
                      <Ionicons
                        name='trash-outline'
                        size={20}
                        color={colors.tint}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Sessions Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontFamily: Fonts?.sans },
                ]}
              >
                Active Sessions ({sessions.length})
              </Text>

              {sessions.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    { backgroundColor: colors.surfaceContainer },
                  ]}
                >
                  <Ionicons
                    name='time-outline'
                    size={48}
                    color={colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.emptyText,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    No active sessions
                  </Text>
                </View>
              ) : (
                sessions.map((session) => (
                  <View
                    key={session.id}
                    style={[
                      styles.sessionCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.outline,
                      },
                    ]}
                  >
                    <View style={styles.sessionInfo}>
                      <Ionicons
                        name='time-outline'
                        size={20}
                        color={colors.primary}
                      />
                      <View style={styles.sessionDetails}>
                        <Text
                          style={[
                            styles.sessionDevice,
                            { color: colors.text, fontFamily: Fonts?.sans },
                          ]}
                        >
                          {session.device?.deviceModel || 'Unknown Device'}
                        </Text>
                        <Text
                          style={[
                            styles.sessionMeta,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          IP: {session.ipAddress || 'Unknown'}
                        </Text>
                        <Text
                          style={[
                            styles.sessionMeta,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          Expires: {formatDate(session.expiresAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Logout All Button */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.logoutAllButton,
                  {
                    borderColor: colors.tint,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 16,
                    alignItems: 'center',
                  },
                ]}
                onPress={handleLogoutAll}
              >
                <Text
                  style={{
                    color: colors.tint,
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Logout from All Devices
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  deviceMeta: {
    fontSize: 12,
    marginBottom: 2,
  },
  revokeButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetails: {
    marginLeft: 16,
    flex: 1,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
    marginBottom: 2,
  },
  logoutAllButton: {
    marginTop: 16,
  },
});
