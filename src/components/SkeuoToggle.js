import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

/**
 * Tactile neumorphic toggle switch with smooth animated thumb movement.
 * Used for consent controls, permissions, and theme/privacy settings.
 */
export function SkeuoToggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}) {
  const { colors, shadows } = useTheme();
  const translateX = useRef(new Animated.Value(value ? 22 : 2)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 22 : 2,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      style={[
        styles.track,
        shadows.recessed,
        {
          backgroundColor: value ? colors.primary : colors.surfaceRecessed,
          borderColor: value ? colors.primaryPressed : colors.surfaceBorderSubtle,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          shadows.button,
          {
            backgroundColor: '#FFFFFF',
            transform: [{ translateX }],
          },
        ]}
      >
        <View
          style={[
            styles.thumbDot,
            { backgroundColor: value ? colors.primary : colors.statusNeutral },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.7,
  },
});
