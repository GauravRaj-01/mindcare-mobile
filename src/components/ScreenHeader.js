import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

/**
 * Consistent MindCare screen header with optional back button and right action button
 * (for example, theme toggle or manual sync trigger).
 */
export function ScreenHeader({
  title,
  subtitle,
  overline,
  onBack,
  rightIcon,
  onRightPress,
  rightLabel,
  style,
}) {
  const { colors, shadows, radii, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }, style]}>
      <View style={styles.leftGroup}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [
              styles.iconBtn,
              pressed ? shadows.buttonPressed : shadows.card,
              {
                backgroundColor: colors.surface,
                borderRadius: radii.sm,
                marginRight: spacing.sm,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
        ) : null}

        <View style={styles.titleBlock}>
          {overline ? (
            <Text style={[typography.overline, { color: colors.primary }]}>
              {overline}
            </Text>
          ) : null}
          <Text style={[typography.h1, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                typography.body,
                { color: colors.textMuted, marginTop: 2 },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightIcon ? (
        <Pressable
          onPress={onRightPress}
          accessibilityRole="button"
          accessibilityLabel={rightLabel || 'Header action'}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed ? shadows.buttonPressed : shadows.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.sm,
            },
          ]}
        >
          <Ionicons name={rightIcon} size={20} color={colors.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  iconBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
