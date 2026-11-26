import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GlassPanel,
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoInput,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';

/**
 * Login & Sign Up Screen
 * Uses a minimal Glassmorphism container, recessed neumorphic inputs,
 * client-side validation, and Google Sign-In button.
 */
export function AuthScreen({ navigation, route }) {
  const initialMode = route?.params?.initialMode || 'login';
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  const [name, setName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isLoading } =
    useAuth();

  const isSignup = mode === 'signup';

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};
    if (isSignup && name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!email.trim() || !email.includes('@')) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isSignup) {
      await signUpWithEmail({ name, email, universityId });
    } else {
      await signInWithEmail({ email, password });
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScreenHeader
          overline="MindCare Account"
          title={isSignup ? 'Create Account' : 'Welcome Back'}
          subtitle={
            isSignup
              ? 'Set up your student wellness profile'
              : 'Sign in to view your daily balance'
          }
          onBack={() => navigation.goBack()}
          rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
          onRightPress={toggleTheme}
        />

        {/* Recessed Segmented Switcher */}
        <View
          style={[
            styles.segmentTrack,
            shadows.recessed,
            {
              backgroundColor: colors.surfaceRecessed,
              borderRadius: radii.md,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {[
            { key: 'login', label: 'Sign In' },
            { key: 'signup', label: 'Sign Up' },
          ].map((tab) => {
            const active = mode === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => switchMode(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[
                  styles.segmentTab,
                  active && shadows.card,
                  {
                    backgroundColor: active ? colors.surface : 'transparent',
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.h3,
                    {
                      color: active ? colors.textPrimary : colors.textMuted,
                      fontSize: 15,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Minimal Glassmorphism Auth Panel */}
        <GlassPanel style={{ marginBottom: spacing.lg }}>
          <View style={{ gap: spacing.md }}>
            {isSignup ? (
              <>
                <SkeuoInput
                  label="Full Name"
                  icon="person-outline"
                  placeholder="e.g., Aarav Sharma"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                />
                <SkeuoInput
                  label="Student / Roll ID (Optional)"
                  icon="id-card-outline"
                  placeholder="e.g., STU-2026-042"
                  autoCapitalize="characters"
                  value={universityId}
                  onChangeText={setUniversityId}
                />
              </>
            ) : null}

            <SkeuoInput
              label="Student Email"
              icon="mail-outline"
              placeholder="you@university.edu"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <SkeuoInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Minimum 6 characters"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <SkeuoButton
              title={isSignup ? 'Create Student Account' : 'Sign In'}
              icon={isSignup ? 'checkmark-circle-outline' : 'log-in-outline'}
              loading={isLoading}
              onPress={handleSubmit}
              style={{ marginTop: spacing.xs }}
            />
          </View>

          {/* Divider */}
          <View style={[styles.dividerRow, { marginVertical: spacing.lg }]}>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, marginHorizontal: spacing.sm },
              ]}
            >
              or continue quickly
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          </View>

          {/* Google Sign-In */}
          <SkeuoButton
            title="Continue with Google"
            variant="secondary"
            icon="logo-google"
            loading={isLoading}
            onPress={signInWithGoogle}
          />
        </GlassPanel>

        {/* Privacy reassurance footer */}
        <View style={styles.footerNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[typography.caption, { color: colors.textMuted, flex: 1 }]}>
            Prototype mode: Google & Firebase Auth will be connected in the backend integration phase.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  segmentTrack: {
    flexDirection: 'row',
    padding: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});
