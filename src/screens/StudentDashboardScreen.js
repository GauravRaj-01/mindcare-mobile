import { Text, View } from 'react-native';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoStatCard,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';

/**
 * Temporary landing screen after login while we complete Phase 2 screens
 * step by step (Dashboard, Screen-Time, Activity, Mood, Consent, Profile).
 */
export function StudentDashboardScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme, spacing, typography } = useTheme();

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="MindCare Student"
        title={`Hi, ${user?.name || 'Student'}`}
        subtitle={user?.email}
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        <SkeuoStatCard
          title="Screen Time"
          value="3h 42m"
          subtitle="Daily summary"
          icon="phone-portrait-outline"
          status="positive"
          statusLabel="Balanced"
        />
        <SkeuoStatCard
          title="Daily Steps"
          value="6,820"
          subtitle="Today"
          icon="footsteps-outline"
          status="neutral"
          statusLabel="Active"
        />
      </View>

      <SkeuoCard variant="elevated" style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Signed In Successfully
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
          ]}
        >
          Welcome & Auth navigation are working! Next, we will build the full
          Student Dashboard, Bottom Tab Navigation, Screen-Time Details,
          Physical Activity, Mood Check-in, Consent, and Profile screens.
        </Text>

        <SkeuoButton
          title="Sign Out (Test Auth Flow)"
          variant="secondary"
          icon="log-out-outline"
          onPress={signOut}
        />
      </SkeuoCard>
    </ScreenContainer>
  );
}
