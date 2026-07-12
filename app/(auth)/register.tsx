import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';
import { useCustomTheme } from '@/providers/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, Radius, FontSizes, Fonts, Elevation } from '@/constants/theme';
import { Button, TextInput } from '@/components/ui';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme, colors } = useCustomTheme();

  // Form States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Global States
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.display }]}>JOIN THE RIDE</Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>
            Create your Riding Verse profile
          </Text>
        </View>

          <View style={[styles.formContainer, {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
          }, Elevation.card]}>
            <Text style={[styles.formTitle, { color: colors.text, fontFamily: Fonts?.display }]}>Sign Up</Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.dangerContainer }]}>
                <Ionicons name="alert-circle" size={20} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger, fontFamily: Fonts?.sans }]}>{error}</Text>
              </View>
            )}

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>Full Name</Text>
              <TextInput
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => { setFullName(text); setError(null); }}
                leftIcon="person-outline"
                size="large"
                autoCorrect={false}
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>Username</Text>
              <TextInput
                placeholder="Choose a username"
                value={username}
                onChangeText={(text) => { setUsername(text); setError(null); }}
                leftIcon="at-outline"
                size="large"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => { setEmail(text); setError(null); }}
                leftIcon="mail-outline"
                size="large"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>Password</Text>
              <TextInput
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => { setPassword(text); setError(null); }}
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                type={showPassword ? "text" : "password"}
                size="large"
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>Confirm Password</Text>
              <TextInput
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); setError(null); }}
                leftIcon="shield-checkmark-outline"
                type={showPassword ? "text" : "password"}
                size="large"
              />
            </View>

            <Button
              onPress={handleRegister}
              disabled={loading}
              loading={loading}
              size="large"
              style={{ marginTop: Spacing[4] }}
            >
              Create Account
            </Button>

            <View style={[styles.linkWrapper, { borderTopColor: colors.outlineVariant }]}>
              <Text style={[styles.linkText, { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans }]}>
                Already have an account?{' '}
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkAction, { color: colors.primary, fontFamily: Fonts?.sans }]}>Sign In</Text>
                </TouchableOpacity>
              </Link>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing[6],
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: Radius.lg,
    padding: Spacing[6],
    borderWidth: 1,
  },
  formTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    marginBottom: Spacing[6],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: Radius.md,
    marginBottom: Spacing[4],
  },
  errorText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginLeft: Spacing[2],
    flex: 1,
  },
  inputWrapper: {
    marginBottom: Spacing[4],
  },
  inputLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    marginBottom: Spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  linkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[6],
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing[4],
  },
  linkText: {
    fontSize: FontSizes.sm,
    fontWeight: '400',
  },
  linkAction: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
});
