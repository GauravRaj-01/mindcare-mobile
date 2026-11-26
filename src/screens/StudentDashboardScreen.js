import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoProgress,
  SkeuoStatCard,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

function formatMinutes(totalMinutes) {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

/**
 * Student Dashboard (Home Tab)
 * Displays daily screen-time, steps, active minutes, mood check-in shortcut,
 * daily balance summary, and last synchronization status.
 */
export function StudentDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const {
    steps,
    stepGoal,
    activeMinutes,
    activeGoal,
    screenTimeMinutes,
    screenBudgetMinutes,
    latestMood,
    isCollectionPaused,
    lastSyncedAt,
    pendingSyncCount,
    isSyncing,
    triggerSync,
  } = useWellness();

  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();

  const stepsRatio = steps / stepGoal;
  const activeRatio = activeMinutes / activeGoal;
  const screenRatio = screenTimeMinutes / screenBudgetMinutes;

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="MindCare Student"
        title={`Hello, ${user?.name?.split(' ')[0] || 'Student'}`}
        subtitle="Here is your daily well-being summary"
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      {/* Last Sync Status Strip */}
      <SkeuoCard
        variant="recessed"
        padding={12}
        style={{ marginBottom: spacing.md }}
      >
        <View style={styles.syncRow}>
          <View style={styles.syncLeft}>
            <View
              style={[
                styles.syncDot,
                {
                  backgroundColor: isCollectionPaused
                    ? colors.statusAttention
                    : colors.statusPositive,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
                {isCollectionPaused
                  ? 'Data Collection Paused'
                  : 'Sync Ready'}
              </Text>
              <Text style={[styles.syncTime, { color: colors.textMuted }]}>
                Last synced: {lastSyncedAt}
                {pendingSyncCount > 0 ? ` • ${pendingSyncCount} queued` : ''}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={triggerSync}
            disabled={isCollectionPaused || isSyncing}
            accessibilityRole="button"
            accessibilityLabel="Synchronize now"
            style={({ pressed }) => [
              styles.syncBtn,
              pressed ? shadows.buttonPressed : shadows.card,
              {
                backgroundColor: colors.surface,
                borderRadius: radii.sm,
                opacity: isCollectionPaused ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons
              name={isSyncing ? 'sync' : 'cloud-upload-outline'}
              size={15}
              color={colors.primary}
            />
            <Text
              style={[
                typography.caption,
                { color: colors.primary, fontWeight: '700', marginLeft: 5 },
              ]}
            >
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Text>
          </Pressable>
        </View>
      </SkeuoCard>

      {/* Primary Stat Cards Row */}
      <View style={[styles.row, { gap: spacing.sm, marginBottom: spacing.sm }]}>
        <SkeuoStatCard
          title="Screen Time"
          value={formatMinutes(screenTimeMinutes)}
          subtitle="Today's total"
          icon="phone-portrait-outline"
          status={screenRatio > 1 ? 'attention' : 'positive'}
          statusLabel={screenRatio > 1 ? 'Higher' : 'Balanced'}
        />
        <SkeuoStatCard
          title="Daily Steps"
          value={steps.toLocaleString()}
          subtitle={`Goal: ${stepGoal.toLocaleString()}`}
          icon="footsteps-outline"
          status={stepsRatio >= 0.75 ? 'positive' : 'neutral'}
          statusLabel={`${Math.round(stepsRatio * 100)}%`}
        />
      </View>

      {/* Active Minutes + Mood Quick Card */}
      <View style={[styles.row, { gap: spacing.sm, marginBottom: spacing.md }]}>
        <SkeuoStatCard
          title="Active Minutes"
          value={`${activeMinutes}m`}
          subtitle={`Goal: ${activeGoal}m`}
          icon="walk-outline"
          status="positive"
          statusLabel="Steady"
        />
        <SkeuoStatCard
          title="Latest Mood"
          value={latestMood ? latestMood.label : 'Unlogged'}
          subtitle={latestMood ? latestMood.timestamp : 'Tap Mood tab'}
          icon="heart-outline"
          status="neutral"
          statusLabel="Optional"
        />
      </View>

      {/* Daily Activity Summary */}
      <SkeuoCard variant="elevated" style={{ marginBottom: spacing.md }}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Daily Activity Summary
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
          ]}
        >
          Your gentle personal overview—never a clinical evaluation
        </Text>

        <SkeuoProgress
          label="Movement Goal"
          valueText={`${steps.toLocaleString()} / ${stepGoal.toLocaleString()} steps`}
          progress={stepsRatio}
          style={{ marginBottom: spacing.md }}
        />

        <SkeuoProgress
          label="Active Minutes"
          valueText={`${activeMinutes} / ${activeGoal} min`}
          progress={activeRatio}
          color={colors.statusPositive}
          style={{ marginBottom: spacing.md }}
        />

        <SkeuoProgress
          label="Screen Balance Reference"
          valueText={`${formatMinutes(screenTimeMinutes)} / ${formatMinutes(screenBudgetMinutes)}`}
          progress={screenRatio}
          color={screenRatio > 1 ? colors.statusAttention : colors.brand.mutedGold}
        />
      </SkeuoCard>

      {/* Quick Mood Check-in Callout */}
      <SkeuoCard variant="raised">
        <View style={styles.moodCallout}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[typography.h3, { color: colors.textPrimary }]}>
              Quick Mood Check-in
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textSecondary, marginTop: 4 },
              ]}
            >
              Take 10 seconds to log how your day feels right now.
            </Text>
          </View>
          <SkeuoButton
            title="Check In"
            icon="sparkles-outline"
            fullWidth={false}
            onPress={() => navigation.navigate('Mood')}
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
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  syncDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  syncTime: {
    fontSize: 12,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moodCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
