import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { SkeuoCard } from './SkeuoCard';

/**
 * Layered statistic card for key daily metrics (screen time, steps, active minutes).
 * Supports MindCare calm status tones: "positive", "attention", "important", "neutral".
 */
export function SkeuoStatCard({
  title,
  value,
  subtitle,
  icon = 'analytics-outline',
  status = 'neutral',
  statusLabel,
  style,
}) {
  const { colors, radii, spacing, typography } = useTheme();

  const statusMap = {
    positive: { color: colors.statusPositive, bg: colors.statusPositiveBg },
    attention: { color: colors.statusAttention, bg: colors.statusAttentionBg },
    important: { color: colors.statusImportant, bg: colors.statusImportantBg },
    neutral: { color: colors.primary, bg: colors.primarySoft },
  };

  const tone = statusMap[status] || statusMap.neutral;

  return (
    <SkeuoCard variant="raised" style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWell,
            {
              backgroundColor: tone.bg,
              borderRadius: radii.sm,
            },
          ]}
        >
          <Ionicons name={icon} size={20} color={tone.color} />
        </View>

        {statusLabel ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: tone.bg, borderRadius: radii.pill },
            ]}
          >
            <Text style={[styles.badgeText, { color: tone.color }]}>
              {statusLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, marginTop: spacing.sm },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          typography.statLarge,
          { color: colors.textPrimary, marginTop: 2 },
        ]}
      >
        {value}
      </Text>

      {subtitle ? (
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: 4 },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </SkeuoCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
