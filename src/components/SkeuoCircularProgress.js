import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

/**
 * Neumorphic Circular Progress Ring built with layered half-circle rotations
 * and a raised inner dial—works reliably on Android without extra SVG native dependencies.
 */
export function SkeuoCircularProgress({
  progress = 0, // 0 to 1
  size = 176,
  strokeWidth = 16,
  valueText,
  label,
  sublabel,
  accentColor,
}) {
  const { colors, shadows, typography } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const ringColor = accentColor || colors.primary;

  const firstHalfDeg = clamped <= 0.5 ? clamped * 360 : 180;
  const secondHalfDeg = clamped > 0.5 ? (clamped - 0.5) * 360 : 0;
  const innerSize = size - strokeWidth * 2;

  return (
    <View
      style={[
        styles.outerShell,
        shadows.card,
        {
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
          backgroundColor: colors.surface,
        },
      ]}
    >
      {/* Recessed track */}
      <View
        style={[
          styles.track,
          shadows.recessed,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.surfaceRecessed,
          },
        ]}
      >
        {/* Right half arc (0% -> 50%) */}
        <View
          collapsable={false}
          style={[
            styles.halfClip,
            {
              width: size / 2,
              height: size,
              left: size / 2,
            },
          ]}
        >
          <View
            style={[
              styles.rotatingCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                left: -size / 2,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderTopColor: ringColor,
                borderRightColor: ringColor,
                transform: [{ rotate: `${-135 + firstHalfDeg}deg` }],
              },
            ]}
          />
        </View>

        {/* Left half arc (50% -> 100%) */}
        {clamped > 0.5 ? (
          <View
            collapsable={false}
            style={[
              styles.halfClip,
              {
                width: size / 2,
                height: size,
                left: 0,
              },
            ]}
          >
            <View
              style={[
                styles.rotatingCircle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  left: 0,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderBottomColor: ringColor,
                  borderLeftColor: ringColor,
                  transform: [{ rotate: `${-135 + secondHalfDeg}deg` }],
                },
              ]}
            />
          </View>
        ) : null}

        {/* Raised inner neumorphic dial */}
        <View
          style={[
            styles.innerDial,
            shadows.elevated,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <Text style={[typography.statLarge, { color: colors.textPrimary }]}>
            {valueText}
          </Text>
          {label ? (
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
              {label}
            </Text>
          ) : null}
          {sublabel ? (
            <Text style={[styles.sublabel, { color: colors.textMuted }]}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  halfClip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  rotatingCircle: {
    position: 'absolute',
    top: 0,
  },
  innerDial: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sublabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
