import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { SkeuoCard } from './SkeuoCard';

/**
 * Reusable Soft Skeuomorphic Chart Card.
 * Renders clean, readable vertical bars inside recessed tracks without heavy dependencies.
 */
export function SkeuoChartCard({
  title,
  subtitle,
  data = [],
  unit = '',
  barColor,
  formatValue,
  style,
}) {
  const { colors, shadows, radii, spacing, typography } = useTheme();
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const activeColor = barColor || colors.primary;

  return (
    <SkeuoCard variant="elevated" style={style}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, marginTop: 2 },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.chartArea,
          shadows.recessed,
          {
            backgroundColor: colors.surfaceRecessed,
            borderRadius: radii.md,
            marginTop: spacing.md,
            padding: spacing.md,
          },
        ]}
      >
        <View style={styles.barsRow}>
          {data.map((item, idx) => {
            const pct = Math.max(8, Math.round((item.value / maxVal) * 100));
            const isLast = idx === data.length - 1;
            const displayValue = formatValue
              ? formatValue(item.value)
              : `${item.value}${unit}`;

            return (
              <View key={item.label} style={styles.barColumn}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.valueLabel,
                    { color: isLast ? colors.textPrimary : colors.textMuted },
                  ]}
                >
                  {displayValue}
                </Text>

                <View
                  style={[
                    styles.barTrack,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderRadius: radii.pill,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={
                      isLast
                        ? [colors.accentMint, activeColor]
                        : [activeColor, colors.brand.deepNavy]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[
                      styles.barFill,
                      {
                        height: `${pct}%`,
                        borderRadius: radii.pill,
                        opacity: isLast ? 1 : 0.72,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    typography.caption,
                    {
                      color: isLast ? colors.primary : colors.textSecondary,
                      fontWeight: isLast ? '700' : '500',
                      marginTop: 6,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SkeuoCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  chartArea: {
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    gap: 6,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  barTrack: {
    width: 16,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 2,
  },
  barFill: {
    width: '100%',
  },
});
