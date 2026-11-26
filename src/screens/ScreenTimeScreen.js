import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoCard,
  SkeuoChartCard,
  SkeuoProgress,
  SkeuoStatCard,
} from '../components';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

const CATEGORIES = ['All', 'Education', 'Video', 'Social', 'Messaging'];

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

/**
 * Screen-Time Details Screen
 * Displays layered screen-time stats, 7-day trend chart, category filters,
 * and per-app usage breakdown.
 */
export function ScreenTimeScreen() {
  const {
    screenTimeMinutes,
    screenBudgetMinutes,
    appUsage,
    weeklyScreenTime,
    permissions,
    isCollectionPaused,
  } = useWellness();

  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const weeklyAvgMinutes = useMemo(() => {
    const sum = weeklyScreenTime.reduce((acc, day) => acc + day.value, 0);
    return Math.round(sum / weeklyScreenTime.length);
  }, [weeklyScreenTime]);

  const filteredApps = useMemo(() => {
    if (selectedCategory === 'All') return appUsage;
    return appUsage.filter((app) => app.category === selectedCategory);
  }, [appUsage, selectedCategory]);

  const isPaused = isCollectionPaused || !permissions.usageAccess;

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="Digital Habits"
        title="Screen Time"
        subtitle="Daily summaries & app-wise breakdown"
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      {isPaused ? (
        <SkeuoCard variant="recessed" style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyMedium, { color: colors.statusAttention }]}>
            Usage Access tracking is currently paused. Enable it in Consent &
            Permissions to resume collecting app summaries.
          </Text>
        </SkeuoCard>
      ) : null}

      {/* Top Layered Statistic Cards */}
      <View style={[styles.row, { gap: spacing.sm, marginBottom: spacing.md }]}>
        <SkeuoStatCard
          title="Today Total"
          value={formatDuration(screenTimeMinutes)}
          subtitle={`Ref: ${formatDuration(screenBudgetMinutes)}`}
          icon="time-outline"
          status={screenTimeMinutes > screenBudgetMinutes ? 'attention' : 'positive'}
          statusLabel={screenTimeMinutes > screenBudgetMinutes ? 'Above Avg' : 'Balanced'}
        />
        <SkeuoStatCard
          title="7-Day Average"
          value={formatDuration(weeklyAvgMinutes)}
          subtitle="Daily baseline"
          icon="stats-chart-outline"
          status="neutral"
          statusLabel="Weekly"
        />
      </View>

      {/* Weekly Usage Chart */}
      <SkeuoChartCard
        title="Weekly Screen Time"
        subtitle="Total daily hours over the last 7 days"
        data={weeklyScreenTime}
        formatValue={(mins) => `${(mins / 60).toFixed(1)}h`}
        style={{ marginBottom: spacing.md }}
      />

      {/* App-wise Usage Breakdown */}
      <SkeuoCard variant="elevated">
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          App-Wise Breakdown
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: 2, marginBottom: spacing.sm },
          ]}
        >
          Only app durations and categories are summarized—never screen content.
        </Text>

        {/* Filter Chips */}
        <View style={[styles.chipRow, { marginBottom: spacing.md }]}>
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.chip,
                  active ? shadows.recessed : shadows.card,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderRadius: radii.pill,
                    borderColor: active ? colors.primary : colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: active ? colors.primary : colors.textSecondary,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* App Rows */}
        {filteredApps.map((app, index) => {
          const share = app.minutes / screenTimeMinutes;
          return (
            <View
              key={app.id}
              style={[
                styles.appRow,
                index < filteredApps.length - 1 && {
                  marginBottom: spacing.md,
                  paddingBottom: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.divider,
                },
              ]}
            >
              <View style={styles.appHeader}>
                <View style={styles.appTitleGroup}>
                  <View
                    style={[
                      styles.appIconWell,
                      {
                        backgroundColor: colors.primarySoft,
                        borderRadius: radii.sm,
                      },
                    ]}
                  >
                    <Ionicons name={app.icon} size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
                      {app.name}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textMuted }]}>
                      {app.category}
                    </Text>
                  </View>
                </View>

                <Text style={[typography.h3, { color: colors.textPrimary }]}>
                  {formatDuration(app.minutes)}
                </Text>
              </View>

              <SkeuoProgress
                progress={share}
                height={8}
                color={
                  app.category === 'Education'
                    ? colors.statusPositive
                    : colors.primary
                }
                style={{ marginTop: spacing.xs }}
              />
            </View>
          );
        })}
      </SkeuoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  appRow: {
    width: '100%',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIconWell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
