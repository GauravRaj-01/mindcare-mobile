import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoChartCard,
  SkeuoCircularProgress,
  SkeuoStatCard,
} from '../components';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

/**
 * Physical Activity Screen
 * Features a neumorphic circular step ring, interactive step counter test control,
 * active-minute stats, and weekly movement trends.
 */
export function PhysicalActivityScreen() {
  const {
    steps,
    stepGoal,
    activeMinutes,
    activeGoal,
    weeklySteps,
    addStepsSample,
    permissions,
    isCollectionPaused,
  } = useWellness();

  const { colors, spacing, typography, isDark, toggleTheme } = useTheme();

  const stepProgress = steps / stepGoal;
  const approxKm = (steps * 0.00076).toFixed(1);
  const isPaused = isCollectionPaused || !permissions.healthConnect;

  // Keep the latest bar ("Sun") synced with live step counter state
  const liveWeeklySteps = useMemo(() => {
    return weeklySteps.map((day, index) =>
      index === weeklySteps.length - 1 ? { ...day, value: steps } : day
    );
  }, [weeklySteps, steps]);

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="Movement & Energy"
        title="Physical Activity"
        subtitle="Steps & active minutes via Health Connect"
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      {isPaused ? (
        <SkeuoCard variant="recessed" style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyMedium, { color: colors.statusAttention }]}>
            Health Connect activity sync is currently paused. You can re-enable
            it anytime in Consent & Permissions.
          </Text>
        </SkeuoCard>
      ) : null}

      {/* Neumorphic Circular Step Counter */}
      <SkeuoCard
        variant="elevated"
        style={{ marginBottom: spacing.md, alignItems: 'center' }}
      >
        <View style={styles.ringCenter}>
          <SkeuoCircularProgress
            progress={stepProgress}
            valueText={steps.toLocaleString()}
            label={`${Math.round(stepProgress * 100)}% of goal`}
            sublabel={`Target: ${stepGoal.toLocaleString()} steps`}
          />
        </View>

        <Text
          style={[
            typography.caption,
            {
              color: colors.textMuted,
              textAlign: 'center',
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Prototype simulator (real Health Connect step sync arrives in Phase 3)
        </Text>

        <View style={[styles.row, { gap: spacing.sm }]}>
          <SkeuoButton
            title="+500 Steps"
            icon="walk-outline"
            onPress={() => addStepsSample(500)}
            style={{ flex: 1 }}
          />
          <SkeuoButton
            title="+1,000 Steps"
            variant="secondary"
            icon="add-outline"
            onPress={() => addStepsSample(1000)}
            style={{ flex: 1 }}
          />
        </View>
      </SkeuoCard>

      {/* Active Minutes & Estimated Distance */}
      <View style={[styles.row, { gap: spacing.sm, marginBottom: spacing.md }]}>
        <SkeuoStatCard
          title="Active Minutes"
          value={`${activeMinutes}m`}
          subtitle={`Goal: ${activeGoal}m`}
          icon="flame-outline"
          status={activeMinutes >= activeGoal ? 'positive' : 'neutral'}
          statusLabel={activeMinutes >= activeGoal ? 'Goal Met' : 'In Progress'}
        />
        <SkeuoStatCard
          title="Distance"
          value={`${approxKm} km`}
          subtitle="Estimated today"
          icon="navigate-outline"
          status="positive"
          statusLabel="Steady"
        />
      </View>

      {/* Weekly Steps Trend */}
      <SkeuoChartCard
        title="Weekly Step Trend"
        subtitle="Daily steps over the past 7 days"
        data={liveWeeklySteps}
        barColor={colors.statusPositive}
        formatValue={(val) => `${(val / 1000).toFixed(1)}k`}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
  },
});
