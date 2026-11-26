import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

/**
 * Animated neumorphic linear progress bar.
 * Recessed track + smooth gradient fill for daily goals, screen-time budgets, and usage bars.
 */
export function SkeuoProgress({
  progress = 0, // 0 to 1
  label,
  valueText,
  color,
  height = 12,
  style,
}) {
  const { colors, shadows, radii, typography, spacing } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clamped,
      duration: 500,
      useNativeDriver: false, // Width percentage animation requires layout driver
    }).start();
  }, [clamped, widthAnim]);

  const fillColor = color || colors.primary;
  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {(label || valueText) && (
        <View style={[styles.headerRow, { marginBottom: spacing.xs }]}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {label}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.textPrimary, fontWeight: '700' },
            ]}
          >
            {valueText}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.track,
          shadows.recessed,
          {
            height,
            borderRadius: radii.pill,
            backgroundColor: colors.surfaceRecessed,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fillWrapper,
            {
              width: widthInterpolated,
              borderRadius: radii.pill,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.accentMint, fillColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fillGradient, { borderRadius: radii.pill }]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
    padding: 2,
  },
  fillWrapper: {
    height: '100%',
    overflow: 'hidden',
  },
  fillGradient: {
    flex: 1,
  },
});
