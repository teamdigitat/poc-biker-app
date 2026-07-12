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
import { Spacing, Radius, FontSizes, Fonts } from '@/src/constants/theme';
import { apiClient } from '@/src/lib/api-client';

export default function AgeVerificationScreen() {
  const { token } = useAuth();
  const { theme, colors } = useCustomTheme();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [ageStatus, setAgeStatus] = useState<any>(null);

  useEffect(() => {
    checkAgeStatus();
  }, []);

  const checkAgeStatus = async () => {
    try {
      const response = await apiClient.get('/auth/age/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgeStatus(response.data);
    } catch (error) {
      console.error('Failed to check age status:', error);
    }
  };

  const showDatepicker = () => {
    // Simple date picker using native modal
    Alert.alert(
      'Enter Date of Birth',
      'Please enter your date of birth in YYYY-MM-DD format',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            // For simplicity, we'll set a default date for demo
            // In production, use a proper date picker library
            const demoDate = new Date('2000-01-01');
            setDateOfBirth(demoDate);
          },
        },
      ],
    );
  };

  const handleVerifyAge = async () => {
    if (!dateOfBirth) {
      Alert.alert('Error', 'Please select your date of birth');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/age/verify',
        { dateOfBirth: dateOfBirth.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAgeStatus(response.data);
      Alert.alert(
        'Success',
        response.data.isAdult
          ? 'Age verified successfully'
          : 'Parental consent required',
      );
      await checkAgeStatus();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to verify age',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitParentalConsent = async () => {
    if (!parentEmail || !parentName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/age/parental-consent',
        { parentEmail, parentName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert('Success', 'Parental consent submitted successfully');
      setParentEmail('');
      setParentName('');
      await checkAgeStatus();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit parental consent',
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: Fonts?.display },
            ]}
          >
            Age Verification
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans },
            ]}
          >
            Verify your age to access all features
          </Text>
        </View>

        {/* Age Status Card */}
        {ageStatus && (
          <View
            style={[
              styles.statusCard,
              { backgroundColor: colors.surface, borderColor: colors.outline },
            ]}
          >
            <View style={styles.statusIcon}>
              <Ionicons
                name={ageStatus.canAccess ? 'checkmark-circle' : 'alert-circle'}
                size={32}
                color={ageStatus.canAccess ? colors.tint : colors.icon}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text
                style={[
                  styles.statusText,
                  { color: colors.text, fontFamily: Fonts?.sans },
                ]}
              >
                {ageStatus.canAccess
                  ? 'Age Verified'
                  : 'Age Verification Required'}
              </Text>
              <Text
                style={[
                  styles.statusSubtext,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {ageStatus.isAdult
                  ? 'Adult account'
                  : ageStatus.requiresParentalConsent
                    ? 'Parental consent required'
                    : 'Age not verified'}
              </Text>
            </View>
          </View>
        )}

        {/* Date of Birth Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: Fonts?.sans },
            ]}
          >
            Date of Birth
          </Text>

          <TouchableOpacity
            style={[
              styles.dateButton,
              { backgroundColor: colors.surface, borderColor: colors.outline },
            ]}
            onPress={showDatepicker}
          >
            <Ionicons
              name='calendar-outline'
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {dateOfBirth
                ? formatDate(dateOfBirth)
                : 'Select your date of birth'}
            </Text>
          </TouchableOpacity>

          {dateOfBirth && (
            <View style={styles.ageDisplay}>
              <Text
                style={[styles.ageText, { color: colors.onSurfaceVariant }]}
              >
                You will be {calculateAge(dateOfBirth)} years old
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: colors.tint,
                opacity: !dateOfBirth || loading ? 0.5 : 1,
              },
            ]}
            onPress={handleVerifyAge}
            disabled={!dateOfBirth || loading}
          >
            <Text style={[styles.verifyButtonText, { color: '#fff' }]}>
              Verify Age
            </Text>
          </TouchableOpacity>
        </View>

        {/* Parental Consent Section */}
        {ageStatus?.requiresParentalConsent &&
          !ageStatus?.hasParentalConsent && (
            <View
              style={[
                styles.parentalSection,
                {
                  backgroundColor: colors.surfaceContainer,
                  borderColor: colors.outline,
                },
              ]}
            >
              <View style={styles.parentalHeader}>
                <Ionicons
                  name='people-outline'
                  size={24}
                  color={colors.primary}
                />
                <Text
                  style={[
                    styles.parentalTitle,
                    { color: colors.text, fontFamily: Fonts?.sans },
                  ]}
                >
                  Parental Consent Required
                </Text>
              </View>

              <Text
                style={[
                  styles.parentalDescription,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Since you are under 18, we need parental consent to use this
                app. Please ask your parent or guardian to provide their
                information.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Parent's Name
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
                  placeholder="Enter parent's full name"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={parentName}
                  onChangeText={setParentName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Parent's Email
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
                  placeholder="Enter parent's email address"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={parentEmail}
                  onChangeText={setParentEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.consentButton,
                  {
                    backgroundColor: colors.tint,
                    opacity: !parentEmail || !parentName || loading ? 0.5 : 1,
                  },
                ]}
                onPress={handleSubmitParentalConsent}
                disabled={!parentEmail || !parentName || loading}
              >
                <Text style={[styles.verifyButtonText, { color: '#fff' }]}>
                  Submit Parental Consent
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* Already Has Consent */}
        {ageStatus?.hasParentalConsent && (
          <View
            style={[
              styles.consentGrantedCard,
              { backgroundColor: colors.surfaceContainerHighest },
            ]}
          >
            <Ionicons name='checkmark-circle' size={24} color={colors.tint} />
            <Text
              style={[
                styles.consentGrantedText,
                { color: colors.text, fontFamily: Fonts?.sans },
              ]}
            >
              Parental consent has been granted
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text
            style={[
              styles.infoTitle,
              { color: colors.text, fontFamily: Fonts?.sans },
            ]}
          >
            Why is this required?
          </Text>
          <Text style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
            To comply with privacy laws and ensure a safe environment for all
            users, we need to verify your age. Users under 13 are not permitted
            to use this app. Users between 13-17 require parental consent.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusIcon: {
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  ageDisplay: {
    marginBottom: 16,
  },
  ageText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  verifyButton: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  parentalSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  parentalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parentalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  parentalDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  consentButton: {
    marginTop: 8,
  },
  consentGrantedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  consentGrantedText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
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
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
