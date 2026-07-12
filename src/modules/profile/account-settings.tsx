import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '@/src/providers/auth-provider';
import { useCustomTheme } from '@/src/providers/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSizes, Fonts } from '@/src/constants/theme';
import { apiClient } from '@/src/lib/api-client';

export default function AccountSettingsScreen() {
  const { token } = useAuth();
  const { theme, colors } = useCustomTheme();
  const [activeTab, setActiveTab] = useState<'recovery' | 'deletion'>(
    'recovery',
  );
  const [identifier, setIdentifier] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [deletionToken, setDeletionToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryMethods, setRecoveryMethods] = useState<any>(null);
  const [deletionStatus, setDeletionStatus] = useState<any>(null);
  const [step, setStep] = useState<'initiate' | 'verify' | 'reset'>('initiate');

  useEffect(() => {
    loadRecoveryMethods();
    loadDeletionStatus();
  }, []);

  const loadRecoveryMethods = async () => {
    try {
      const response = await apiClient.get('/auth/recovery/methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecoveryMethods(response.data);
    } catch (error) {
      console.error('Failed to load recovery methods:', error);
    }
  };

  const loadDeletionStatus = async () => {
    try {
      const response = await apiClient.get('/auth/account/delete/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletionStatus(response.data);
    } catch (error) {
      console.error('Failed to load deletion status:', error);
    }
  };

  const handleInitiateRecovery = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/recovery/initiate',
        { identifier, method },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert('Success', response.data.message);
      if (method === 'phone') {
        setStep('verify');
      } else {
        // Email recovery would send a link
        Alert.alert('Email Sent', 'Check your email for recovery instructions');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to initiate recovery',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/recovery/verify-otp',
        { identifier, otp },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDeletionToken(response.data.recoveryToken);
      setStep('reset');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(
        '/auth/recovery/reset-password',
        { recoveryToken: deletionToken, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert(
        'Success',
        'Password reset successfully. Please login with your new password.',
      );
      setStep('initiate');
      setIdentifier('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to reset password',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateDeletion = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password to confirm');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/account/delete/initiate',
        { password },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDeletionToken(response.data.deletionToken);
      Alert.alert('Deletion Initiated', response.data.message, [
        { text: 'OK' },
        {
          text: 'Cancel Deletion',
          onPress: () => handleCancelDeletion(),
        },
      ]);
      await loadDeletionStatus();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to initiate deletion',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeletion = async () => {
    Alert.alert(
      'Confirm Account Deletion',
      'This action is irreversible. All your data will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await apiClient.post(
                '/auth/account/delete/confirm',
                { deletionToken },
                { headers: { Authorization: `Bearer ${token}` } },
              );

              Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted',
              );
              // Logout user
              const { logout } = useAuth();
              await logout();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete account',
              );
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleCancelDeletion = async () => {
    try {
      await apiClient.post(
        '/auth/account/delete/cancel',
        { deletionToken },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert('Success', 'Account deletion has been cancelled');
      setDeletionToken('');
      await loadDeletionStatus();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to cancel deletion',
      );
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/account/export', {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Data Export', 'Your data has been prepared for export');
      // TODO: Implement actual file download
      console.log('Exported data:', response.data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to export data',
      );
    } finally {
      setLoading(false);
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
          Account Settings
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans },
          ]}
        >
          Manage your account recovery and deletion options
        </Text>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'recovery' && {
              backgroundColor: colors.primaryContainer,
            },
          ]}
          onPress={() => setActiveTab('recovery')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'recovery'
                    ? colors.primary
                    : colors.onSurfaceVariant,
              },
            ]}
          >
            Account Recovery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'deletion' && {
              backgroundColor: colors.primaryContainer,
            },
          ]}
          onPress={() => setActiveTab('deletion')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'deletion'
                    ? colors.primary
                    : colors.onSurfaceVariant,
              },
            ]}
          >
            Account Deletion
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === 'recovery' ? (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: Fonts?.sans },
              ]}
            >
              Account Recovery
            </Text>

            {/* Recovery Methods Info */}
            {recoveryMethods && (
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.surfaceContainer,
                    borderColor: colors.outline,
                  },
                ]}
              >
                <Text style={[styles.infoText, { color: colors.text }]}>
                  Available Recovery Methods:
                </Text>
                {recoveryMethods.hasEmail && (
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    • Email: {recoveryMethods.email}
                  </Text>
                )}
                {recoveryMethods.hasPhone && (
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    • Phone: {recoveryMethods.phone}
                  </Text>
                )}
              </View>
            )}

            {/* Method Selector */}
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  method === 'email' && {
                    backgroundColor: colors.primaryContainer,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setMethod('email')}
              >
                <Ionicons
                  name='mail-outline'
                  size={20}
                  color={
                    method === 'email'
                      ? colors.primary
                      : colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    {
                      color:
                        method === 'email'
                          ? colors.primary
                          : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  method === 'phone' && {
                    backgroundColor: colors.primaryContainer,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setMethod('phone')}
              >
                <Ionicons
                  name='phone-portrait-outline'
                  size={20}
                  color={
                    method === 'phone'
                      ? colors.primary
                      : colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    {
                      color:
                        method === 'phone'
                          ? colors.primary
                          : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Step 1: Initiate Recovery */}
            {step === 'initiate' && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Step 1: Initiate Recovery
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.outline,
                    },
                  ]}
                  placeholder={
                    method === 'email'
                      ? 'Enter your email'
                      : 'Enter your phone number'
                  }
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType={
                    method === 'email' ? 'email-address' : 'phone-pad'
                  }
                  autoCapitalize='none'
                />
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.tint,
                      opacity: loading ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleInitiateRecovery}
                  disabled={loading}
                >
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    Send Recovery Code
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'verify' && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Step 2: Verify OTP
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.outline,
                    },
                  ]}
                  placeholder='Enter 6-digit OTP'
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType='number-pad'
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.tint,
                      opacity: loading ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    Verify OTP
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep('initiate')}>
                  <Text style={[styles.backLink, { color: colors.primary }]}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Step 3: Reset Password
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.outline,
                    },
                  ]}
                  placeholder='New Password (min 8 characters)'
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.outline,
                    },
                  ]}
                  placeholder='Confirm New Password'
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.tint,
                      opacity: loading ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    Reset Password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep('initiate')}>
                  <Text style={[styles.backLink, { color: colors.primary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: Fonts?.sans },
              ]}
            >
              Account Deletion
            </Text>

            {/* Deletion Status */}
            {deletionStatus && deletionStatus.hasPendingDeletion && (
              <View
                style={[
                  styles.warningCard,
                  {
                    backgroundColor: 'rgba(232, 66, 42, 0.1)',
                    borderColor: colors.tint,
                  },
                ]}
              >
                <Ionicons
                  name='warning-outline'
                  size={24}
                  color={colors.tint}
                />
                <View style={styles.warningContent}>
                  <Text style={[styles.warningTitle, { color: colors.text }]}>
                    Pending Deletion
                  </Text>
                  <Text
                    style={[
                      styles.warningText,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Your account is scheduled for deletion on{' '}
                    {new Date(deletionStatus.deletionDate).toLocaleDateString()}
                  </Text>
                  {deletionStatus.canCancel && (
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.outline,
                        },
                      ]}
                      onPress={handleCancelDeletion}
                    >
                      <Text
                        style={[
                          styles.cancelButtonText,
                          { color: colors.text },
                        ]}
                      >
                        Cancel Deletion
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Export Data */}
            <View style={styles.exportCard}>
              <View style={styles.exportHeader}>
                <Ionicons
                  name='download-outline'
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.exportTitle, { color: colors.text }]}>
                  Export Your Data
                </Text>
              </View>
              <Text
                style={[
                  styles.exportDescription,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Download a copy of your personal data before deleting your
                account
              </Text>
              <TouchableOpacity
                style={[
                  styles.exportButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}
                onPress={handleExportData}
                disabled={loading}
              >
                <Text style={[styles.exportButtonText, { color: colors.text }]}>
                  Export Data
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delete Account */}
            <View
              style={[
                styles.dangerCard,
                {
                  backgroundColor: 'rgba(232, 66, 42, 0.1)',
                  borderColor: colors.tint,
                },
              ]}
            >
              <View style={styles.dangerHeader}>
                <Ionicons name='trash-outline' size={24} color={colors.tint} />
                <Text style={[styles.dangerTitle, { color: colors.text }]}>
                  Delete Account
                </Text>
              </View>
              <Text
                style={[
                  styles.dangerDescription,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </Text>

              {!deletionStatus?.hasPendingDeletion && (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: colors.outline,
                      },
                    ]}
                    placeholder='Enter your password to confirm'
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={[
                      styles.dangerButton,
                      {
                        backgroundColor: colors.tint,
                        opacity: loading ? 0.5 : 1,
                      },
                    ]}
                    onPress={handleInitiateDeletion}
                    disabled={loading}
                  >
                    <Text style={[styles.dangerButtonText, { color: '#fff' }]}>
                      Initiate Account Deletion
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {deletionStatus?.hasPendingDeletion && (
                <TouchableOpacity
                  style={[
                    styles.dangerButton,
                    {
                      backgroundColor: colors.tint,
                      opacity: loading ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleConfirmDeletion}
                  disabled={loading}
                >
                  <Text style={[styles.dangerButtonText, { color: '#fff' }]}>
                    Confirm Account Deletion
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                What happens when you delete your account?
              </Text>
              <Text
                style={[
                  styles.deletionInfoText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                • Your profile and personal information will be permanently
                deleted
              </Text>
              <Text
                style={[
                  styles.deletionInfoText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                • Your rides and activity data will be removed
              </Text>
              <Text
                style={[
                  styles.deletionInfoText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                • You will lose access to all premium features
              </Text>
              <Text
                style={[
                  styles.deletionInfoText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                • This action is irreversible
              </Text>
            </View>
          </View>
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
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  stepContainer: {
    padding: 16,
    borderRadius: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    fontSize: 14,
    textAlign: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 8,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exportCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    marginBottom: 16,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  exportDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  exportButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dangerDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  dangerButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
    backgroundColor: 'rgba(232, 66, 42, 0.1)',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  deletionInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
