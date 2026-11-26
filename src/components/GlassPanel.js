import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

/**
 * Minimal Glassmorphism container for floating auth panels, notices, and overlays.
 * Combines a translucent tint, subtle glass border, and soft blur without sacrificing contrast.
 */
export function GlassPanel({ children, intensity = 35, style, contentStyle }) {
  const { colors, shadows, radii, layout } = useTheme();

  return (
    <View
      style={[
        styles.outer,
        shadows.card,
        {
          borderRadius: radii.xl,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={colors.mode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.blur,
          {
            backgroundColor: colors.glassBackground,
            padding: layout.cardPadding + 2,
          },
          contentStyle,
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    width: '100%',
  },
});
