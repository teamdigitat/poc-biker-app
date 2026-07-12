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
import { Spacing, Radius, FontSizes, Fonts, Elevation } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme, colors } = useCustomTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
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
            <View style={[styles.logoBadge, { backgroundColor: colors.surfaceContainerHigh }, Elevation.card]}>
              <Ionicons name="bicycle" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.display }]}>Riding Verse</Text>
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              Connect with riders worldwide
            </Text>
          </View>

          <View style={[styles.formContainer, { 
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
          }, Elevation.card]}>
            <Text style={[styles.formTitle, { color: colors.text, fontFamily: Fonts?.display }]}>Sign In</Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.dangerContainer }]}>
                <Ionicons name="alert-circle" size={20} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant }]}>Email or Username</Text>
              <View style={[styles.inputContainer, { 
                backgroundColor: isDark ? colors.surfaceContainer : colors.surface,
                borderColor: colors.outline,
              }]}>
                <Ionicons name="mail-outline" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text, fontFamily: Fonts?.sans }]}
                  placeholder="Enter email or username"
                  placeholderTextColor={colors.onSurfaceMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant }]}>Password</Text>
              <View style={[styles.inputContainer, { 
                backgroundColor: isDark ? colors.surfaceContainer : colors.surface,
                borderColor: colors.outline,
              }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text, fontFamily: Fonts?.sans }]}
                  placeholder="Enter password"
                  placeholderTextColor={colors.onSurfaceMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.onSurfaceVariant} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: colors.primary }, Elevation.card]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={[styles.loginButtonText, { color: colors.onPrimary, fontFamily: Fonts?.sans }]}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={[styles.linkWrapper, { borderTopColor: colors.outlineVariant }]}>
              <Text style={[styles.linkText, { color: colors.onSurfaceVariant }]}>
                Don't have an account?{' '}
              </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkAction, { color: colors.primary }]}>Sign Up</Text>
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
    padding: Spacing[6],
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing[8],
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
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSizes.base,
    fontWeight: '400',
  },
  formContainer: {
    borderRadius: Radius.lg,
    padding: Spacing[6],
    borderWidth: 1,
  },
  formTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
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
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
  },
  inputIcon: {
    marginRight: Spacing[3],
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    height: '100%',
  },
  eyeIcon: {
    padding: Spacing[1],
  },
  loginButton: {
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[3],
  },
  loginButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '700',
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
