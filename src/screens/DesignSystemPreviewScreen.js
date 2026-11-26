import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  GlassPanel,
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoInput,
  SkeuoProgress,
  SkeuoStatCard,
  SkeuoToggle,
} from '../components';
import { useTheme } from '../theme';

/**
 * Interactive Design System verification screen.
 * Lets us test Light/Dark themes, tactile depth, typography, and contrast on a real Android phone
 * before building the individual MindCare screens.
 */
export function DesignSystemPreviewScreen() {
  const { colors, isDark, toggleTheme, spacing, typography } = useTheme();
  const [note, setNote] = useState('');
  const [usageConsent, setUsageConsent] = useState(true);
  const [stepsProgress, setStepsProgress] = useState(0.68);

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="MindCare Design System"
        title="Component Kit"
        subtitle="Soft Skeuomorphism • Neumorphism • Glass"
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        rightLabel="Toggle light or dark theme"
        onRightPress={toggleTheme}
      />

      {/* Stat Cards Row */}
      <View style={[styles.row, { gap: spacing.sm, marginBottom: spacing.md }]}>
        <SkeuoStatCard
          title="Screen Time"
          value="3h 42m"
          subtitle="18m less than avg"
          icon="phone-portrait-outline"
          status="positive"
          statusLabel="Steady"
        />
        <SkeuoStatCard
          title="Daily Steps"
          value="6,820"
          subtitle="Goal: 10,000"
          icon="footsteps-outline"
          status="neutral"
          statusLabel="Active"
        />
      </View>

      {/* Progress & Tactile Action */}
      <SkeuoCard variant="elevated" style={{ marginBottom: spacing.md }}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Daily Activity Goal
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
          ]}
        >
          Animated neumorphic progress track
        </Text>

        <SkeuoProgress
          label="Movement Progress"
          valueText={`${Math.round(stepsProgress * 100)}%`}
          progress={stepsProgress}
          style={{ marginBottom: spacing.md }}
        />

        <View style={[styles.row, { gap: spacing.sm }]}>
          <SkeuoButton
            title="+10% Steps"
            icon="add-circle-outline"
            onPress={() => setStepsProgress((p) => (p >= 1 ? 0.2 : Math.min(1, p + 0.1)))}
            style={{ flex: 1 }}
          />
          <SkeuoButton
            title={isDark ? 'Light Mode' : 'Dark Mode'}
            variant="secondary"
            icon={isDark ? 'sunny-outline' : 'moon-outline'}
            onPress={toggleTheme}
            style={{ flex: 1 }}
          />
        </View>
      </SkeuoCard>

      {/* Glass Panel + Recessed Input */}
      <GlassPanel style={{ marginBottom: spacing.md }}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Minimal Glassmorphism Panel
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md },
          ]}
        >
          Used selectively for login cards and floating notices while keeping text crisp.
        </Text>

        <SkeuoInput
          label="Quick Reflection"
          icon="create-outline"
          placeholder="How is your energy today?"
          value={note}
          onChangeText={setNote}
          helperText="Stored privately on your device until you choose to sync."
        />
      </GlassPanel>

      {/* Consent Toggle Card */}
      <SkeuoCard variant="raised">
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={[typography.h3, { color: colors.textPrimary }]}>
              App Usage Summary
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
              Toggle to test neumorphic switch feedback
            </Text>
          </View>
          <SkeuoToggle
            value={usageConsent}
            onValueChange={setUsageConsent}
            accessibilityLabel="Toggle app usage summary"
          />
        </View>
      </SkeuoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    flex: 1,
    paddingRight: 16,
  },
});
