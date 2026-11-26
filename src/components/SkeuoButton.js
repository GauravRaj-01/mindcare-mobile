import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

/**
 * Tactile MindCare button with subtle press-in spring animation and shadow compression.
 *
 * Variants:
 * - "primary": Muted Teal gradient (main actions)
 * - "navy": Deep Navy gradient (authoritative actions)
 * - "secondary": Soft raised ivory/slate surface (secondary actions)
 * - "ghost": Minimal text/icon button without heavy surface
 */
export function SkeuoButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}) {
  const { colors, shadows, radii, typography, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) => {
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const getPalette = () => {
    switch (variant) {
      case 'navy':
        return {
          gradient: ['#1F3954', '#172B40'],
          textColor: '#FFFFFF',
          borderColor: 'rgba(255,255,255,0.16)',
        };
      case 'secondary':
        return {
          gradient: isDark
            ? [colors.surfaceElevated, colors.surface]
            : ['#FFFFFF', colors.surfaceRecessed],
          textColor: colors.textPrimary,
          borderColor: colors.surfaceBorder,
        };
      case 'ghost':
        return {
          gradient: ['transparent', 'transparent'],
          textColor: colors.primary,
          borderColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          gradient: [colors.primary, colors.primaryPressed],
          textColor: colors.textOnAccent,
          borderColor: 'rgba(255,255,255,0.25)',
        };
    }
  };

  const palette = getPalette();
  const isInteractive = !disabled && !loading;

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!isInteractive}
        onPressIn={() => isInteractive && animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        style={({ pressed }) => [
          styles.pressable,
          { borderRadius: radii.md },
          variant !== 'ghost' && (pressed ? shadows.buttonPressed : shadows.button),
          !isInteractive && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={palette.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.gradient,
            {
              borderRadius: radii.md,
              borderColor: palette.borderColor,
              borderWidth: variant === 'ghost' ? 0 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={palette.textColor} />
          ) : (
            <View style={styles.contentRow}>
              {icon ? (
                <Ionicons
                  name={icon}
                  size={18}
                  color={palette.textColor}
                  style={styles.icon}
                />
              ) : null}
              <Text
                style={[
                  typography.h3,
                  { color: palette.textColor },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  pressable: {
    overflow: 'visible',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.55,
  },
});
