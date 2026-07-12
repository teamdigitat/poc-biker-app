import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
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
import {
  Button,
  TextInput,
  SegmentedControl,
  Divider,
} from '@/src/components/ui';
import { apiClient } from '@/src/lib/api-client';

export default function LoginScreen() {
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const { theme, colors } = useCustomTheme();

  // Auth Modes
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');

  // Email/Password States
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [otpLoading, setOtpLoading] = useState(false);

  // Global States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpRefs = [
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
  ];

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(Number(countdown - 1)), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

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
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError(null);
    setOtpLoading(true);

    try {
      const deviceInfo = {
        platform: Platform.OS,
        deviceModel: 'Unknown',
        appVersion: '1.0.0',
      };

      const response = await apiClient.post('/auth/otp/send', {
        phone,
        deviceInfo,
      });

      setOtpLoading(false);
      setOtpSent(true);
      setCountdown(30);

      // In development, show the OTP
      if (response.data.otp) {
        Alert.alert('Development OTP', `Your OTP is: ${response.data.otp}`);
      }
    } catch (err: unknown) {
      setOtpLoading(false);
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otpCode.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const deviceInfo = {
        platform: Platform.OS,
        deviceModel: 'Unknown',
        appVersion: '1.0.0',
      };

      const response = await apiClient.post('/auth/otp/verify', {
        phone,
        otp: code,
        deviceInfo,
      });

      if (response.data.isNewUser) {
        // Navigate to registration with phone pre-filled
        Alert.alert('New User', 'Please complete your registration');
        // TODO: Navigate to registration screen with phone
        setLoading(false);
      } else {
        // Existing user - log them in
        const { login: authLogin } = useAuth();
        // TODO: Complete login with OTP (need to implement OTP login endpoint)
        Alert.alert('Success', 'OTP verified successfully');
        setLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP code';
      setError(message);
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = cleanText;
    setOtpCode(newOtp);

    // Move to next input if filled
    if (cleanText && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      const newOtp = [...otpCode];
      newOtp[index - 1] = '';
      setOtpCode(newOtp);
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Apple') => {
    setError(null);
    setLoading(true);

    try {
      const deviceInfo = {
        platform: Platform.OS,
        deviceModel: 'Unknown',
        appVersion: '1.0.0',
      };

      if (provider === 'Google') {
        // TODO: Implement actual Google Sign-In with expo-auth-session
        // For now, use mock token
        const mockIdToken = 'mock_google_id_token';
        await loginWithGoogle(mockIdToken, deviceInfo);
      } else if (provider === 'Apple') {
        // TODO: Implement actual Apple Sign-In with expo-apple-authentication
        // For now, use mock token
        const mockIdentityToken = 'mock_apple_identity_token';
        await loginWithApple(mockIdentityToken, deviceInfo);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to connect with ${provider}`;
      setError(message);
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: Fonts?.display },
            ]}
          >
            RIDING VERSE
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans },
            ]}
          >
            Motorsport & Community hub for riders
          </Text>
        </View>

        {/* Mode Switcher */}
        <SegmentedControl
          items={[
            { label: 'Email Account', value: 'email' },
            { label: 'Phone OTP', value: 'phone' },
          ]}
          selectedValue={loginMode}
          onChange={(val) => {
            setLoginMode(val as 'email' | 'phone');
            setError(null);
          }}
          style={styles.modeSelector}
        />

        <View
          style={[
            styles.formContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
            },
            Elevation.card,
          ]}
        >
          <Text
            style={[
              styles.formTitle,
              { color: colors.text, fontFamily: Fonts?.display },
            ]}
          >
            {loginMode === 'email'
              ? 'Sign In'
              : otpSent
                ? 'Enter Code'
                : 'Verify Phone'}
          </Text>

          {error && (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: colors.dangerContainer },
              ]}
            >
              <Ionicons name='alert-circle' size={20} color={colors.danger} />
              <Text
                style={[
                  styles.errorText,
                  { color: colors.danger, fontFamily: Fonts?.sans },
                ]}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Email Mode Form */}
          {loginMode === 'email' && (
            <>
              <View style={styles.inputWrapper}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: colors.onSurfaceVariant,
                      fontFamily: Fonts?.sans,
                    },
                  ]}
                >
                  Email or Username
                </Text>
                <TextInput
                  placeholder='Enter email or username'
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  leftIcon='mail-outline'
                  size='large'
                  autoCapitalize='none'
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: colors.onSurfaceVariant,
                      fontFamily: Fonts?.sans,
                    },
                  ]}
                >
                  Password
                </Text>
                <TextInput
                  placeholder='Enter password'
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  leftIcon='lock-closed-outline'
                  rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  type={showPassword ? 'text' : 'password'}
                  size='large'
                />
              </View>

              <Button
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
                size='large'
                style={{ marginTop: Spacing[4] }}
              >
                Sign In
              </Button>
            </>
          )}

          {/* Phone OTP Mode Form */}
          {loginMode === 'phone' && (
            <>
              {!otpSent ? (
                <>
                  <View style={styles.inputWrapper}>
                    <Text
                      style={[
                        styles.inputLabel,
                        {
                          color: colors.onSurfaceVariant,
                          fontFamily: Fonts?.sans,
                        },
                      ]}
                    >
                      Phone Number
                    </Text>
                    <TextInput
                      placeholder='Enter 10-digit number'
                      value={phone}
                      onChangeText={(text) => {
                        setPhone(text);
                        setError(null);
                      }}
                      leftIcon='call-outline'
                      size='large'
                      keyboardType='phone-pad'
                      maxLength={10}
                    />
                  </View>

                  <Button
                    onPress={handleSendOTP}
                    disabled={otpLoading}
                    loading={otpLoading}
                    size='large'
                    style={{ marginTop: Spacing[4] }}
                  >
                    Send OTP Code
                  </Button>
                </>
              ) : (
                <>
                  <View style={styles.otpInstructionsContainer}>
                    <Text
                      style={[
                        styles.otpInstructionsText,
                        {
                          color: colors.onSurfaceVariant,
                          fontFamily: Fonts?.sans,
                        },
                      ]}
                    >
                      We sent a 4-digit code to +91 {phone}. Use code{' '}
                      <Text
                        style={{ fontWeight: 'bold', color: colors.primary }}
                      >
                        1234
                      </Text>{' '}
                      for demo.
                    </Text>
                  </View>

                  <View style={styles.otpInputsWrapper}>
                    {otpCode.map((val, idx) => (
                      <RNTextInput
                        key={idx}
                        ref={otpRefs[idx]}
                        style={[
                          styles.otpBox,
                          {
                            backgroundColor: isDark
                              ? colors.surfaceContainer
                              : colors.surface,
                            borderColor: otpCode[idx]
                              ? colors.primary
                              : colors.outline,
                            color: colors.text,
                            fontFamily: Fonts?.sans,
                          },
                        ]}
                        keyboardType='number-pad'
                        maxLength={1}
                        onChangeText={(text) => handleOtpChange(text, idx)}
                        onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                        value={val}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <View style={styles.resendContainer}>
                    {countdown > 0 ? (
                      <Text
                        style={[
                          styles.resendTimerText,
                          {
                            color: colors.onSurfaceVariant,
                            fontFamily: Fonts?.sans,
                          },
                        ]}
                      >
                        Resend code in {countdown}s
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={handleSendOTP}>
                        <Text
                          style={[
                            styles.resendLinkText,
                            {
                              color: colors.primary,
                              fontFamily: Fonts?.sans,
                            },
                          ]}
                        >
                          Resend OTP Code
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Button
                    onPress={handleVerifyOTP}
                    disabled={loading}
                    loading={loading}
                    size='large'
                  >
                    Verify & Login
                  </Button>

                  <TouchableOpacity
                    style={styles.backToPhoneButton}
                    onPress={() => {
                      setOtpSent(false);
                      setOtpCode(['', '', '', '']);
                      setError(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.backToPhoneText,
                        {
                          color: colors.onSurfaceVariant,
                          fontFamily: Fonts?.sans,
                        },
                      ]}
                    >
                      Change Phone Number
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* Social Logins Section */}
          <View style={styles.dividerRow}>
            <Divider style={{ flex: 1 }} />
            <Text
              style={[
                styles.dividerText,
                { color: colors.onSurfaceMuted, fontFamily: Fonts?.sans },
              ]}
            >
              OR CONTINUE WITH
            </Text>
            <Divider style={{ flex: 1 }} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <Button
              variant='outline'
              size='large'
              style={{ flex: 1, borderColor: colors.outline }}
              textStyle={{ color: colors.text }}
              leftIcon={
                <Ionicons
                  name='logo-google'
                  size={20}
                  color='#EA4335'
                  style={styles.socialIcon}
                />
              }
              onPress={() => handleSocialLogin('Google')}
              disabled={loading}
            >
              Google
            </Button>

            <Button
              variant='outline'
              size='large'
              style={{ flex: 1, borderColor: colors.outline }}
              textStyle={{ color: colors.text }}
              leftIcon={
                <Ionicons
                  name='logo-apple'
                  size={20}
                  color={isDark ? '#FFFFFF' : '#000000'}
                  style={styles.socialIcon}
                />
              }
              onPress={() => handleSocialLogin('Apple')}
              disabled={loading}
            >
              Apple
            </Button>
          </View>

          <View
            style={[
              styles.linkWrapper,
              { borderTopColor: colors.outlineVariant },
            ]}
          >
            <Text
              style={[
                styles.linkText,
                { color: colors.onSurfaceVariant, fontFamily: Fonts?.sans },
              ]}
            >
              Don&apos;t have an account?{' '}
            </Text>
            <Link href='/register' asChild>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.linkAction,
                    { color: colors.primary, fontFamily: Fonts?.sans },
                  ]}
                >
                  Sign Up
                </Text>
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
  modeSelector: {
    marginBottom: Spacing[6],
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
  otpInstructionsContainer: {
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[1],
  },
  otpInstructionsText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  otpInputsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: Radius.md,
    textAlign: 'center',
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  resendTimerText: {
    fontSize: FontSizes.sm,
  },
  resendLinkText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  backToPhoneButton: {
    alignItems: 'center',
    marginTop: Spacing[3],
    paddingVertical: Spacing[2],
  },
  backToPhoneText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing[6],
    gap: Spacing[3],
  },
  dividerText: {
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.0,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginBottom: Spacing[6],
  },
  socialIcon: {
    marginRight: Spacing[1],
  },
  linkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
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
