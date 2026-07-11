import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/components/auth-context';
import { useCustomTheme } from '@/components/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme, colors } = useCustomTheme();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(email, username, fullName, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <View style={[styles.logoBadge, { backgroundColor: isDark ? '#2E3236' : '#E8ECEF' }]}>
              <Ionicons name="bicycle" size={40} color={colors.tint} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Join the Ride</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#9BA1A6' : '#687076' }]}>
              Create your rider profile
            </Text>
          </View>

          <View style={[styles.formContainer, {
            backgroundColor: isDark ? '#1F2225' : '#F6F8FA',
            borderColor: isDark ? '#2E3236' : '#E1E4E6'
          }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Sign Up</Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: isDark ? '#421E22' : '#FEE2E2' }]}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>Full Name</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: isDark ? '#151718' : '#FFF',
                borderColor: isDark ? '#2E3236' : '#D1D5DB'
              }]}>
                <Ionicons name="person-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
                  value={fullName}
                  onChangeText={(text) => { setFullName(text); setError(null); }}
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>Username</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: isDark ? '#151718' : '#FFF',
                borderColor: isDark ? '#2E3236' : '#D1D5DB'
              }]}>
                <Ionicons name="at-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Choose a username"
                  placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
                  value={username}
                  onChangeText={(text) => { setUsername(text); setError(null); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>Email</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: isDark ? '#151718' : '#FFF',
                borderColor: isDark ? '#2E3236' : '#D1D5DB'
              }]}>
                <Ionicons name="mail-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
                  value={email}
                  onChangeText={(text) => { setEmail(text); setError(null); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>Password</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: isDark ? '#151718' : '#FFF',
                borderColor: isDark ? '#2E3236' : '#D1D5DB'
              }]}>
                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => { setPassword(text); setError(null); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={isDark ? '#9BA1A6' : '#687076'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: isDark ? '#9BA1A6' : '#687076' }]}>Confirm Password</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: isDark ? '#151718' : '#FFF',
                borderColor: isDark ? '#2E3236' : '#D1D5DB'
              }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={isDark ? '#687076' : '#9CA3AF'}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(text) => { setConfirmPassword(text); setError(null); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: colors.tint }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linkWrapper}>
              <Text style={[styles.linkText, { color: isDark ? '#9BA1A6' : '#687076' }]}>
                Already have an account?{' '}
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkAction, { color: colors.tint }]}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  formContainer: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E1E4E6',
    paddingTop: 16,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
  },
  linkAction: {
    fontSize: 14,
    fontWeight: '700',
  },
});
