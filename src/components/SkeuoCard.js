import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

/**
 * Reusable Soft Skeuomorphic & Neumorphic card container.
 *
 * Variants:
 * - "raised" (default): subtle gradient surface with ambient shadow and crisp highlight border
 * - "elevated": stronger elevation for primary hero or summary cards
 * - "recessed": pressed-in neumorphic well for nested stats or containers
 */
export function SkeuoCard({
  children,
  variant = 'raised',
  padding,
  style,
}) {
  const { colors, shadows, radii, layout, isDark } = useTheme();
  const cardPadding = padding ?? layout.cardPadding;

  if (variant === 'recessed') {
    return (
      <View
        style={[
          styles.base,
          shadows.recessed,
          {
            backgroundColor: colors.surfaceRecessed,
            borderRadius: radii.md,
            padding: cardPadding,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const shadowPreset = variant === 'elevated' ? shadows.elevated : shadows.card;
  const gradientColors =
    variant === 'elevated'
      ? [colors.surfaceElevated, colors.surface]
      : isDark
      ? [colors.surfaceElevated, colors.surface]
      : ['#FFFFFF', colors.surface];

  return (
    <View
      style={[
        styles.base,
        shadowPreset,
        {
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.innerGradient,
          {
            borderRadius: radii.lg - 1,
            padding: cardPadding,
          },
        ]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'visible',
  },
  innerGradient: {
    width: '100%',
  },
});
