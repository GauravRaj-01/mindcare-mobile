import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, SkeuoButton, SkeuoCard } from '../components';
import { useTheme } from '../theme';

const ONBOARDING_POINTS = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Your Consent Comes First',
    description: 'You choose what summaries to share and can pause or revoke anytime.',
  },
  {
    icon: 'pulse-outline',
    title: 'Gentle Pattern Awareness',
    description: 'Highlights shifts in routine for counselor support—never a medical diagnosis.',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Private by Design',
    description: 'No messages, contacts, call logs, or continuous GPS location are collected.',
  },
];

/**
 * MindCare Welcome Screen
 * Features a soft gradient backdrop, subtle embossed emblem, and smooth entrance animation.
 */
export function WelcomeScreen({ navigation }) {
  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <ScreenContainer>
      <Animated.View
        style={[
          styles.wrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Top bar with subtle theme toggle */}
        <View style={styles.topBar}>
          <View
            style={[
              styles.pillBadge,
              {
                backgroundColor: colors.primarySoft,
                borderRadius: radii.pill,
              },
            ]}
          >
            <Text style={[typography.overline, { color: colors.primary }]}>
              Student Well-Being
            </Text>
          </View>

          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel="Switch light or dark theme"
            style={({ pressed }) => [
              styles.themeBtn,
              pressed ? shadows.buttonPressed : shadows.card,
              {
                backgroundColor: colors.surface,
                borderRadius: radii.sm,
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        {/* Embossed Soft Skeuomorphic Logo Emblem */}
        <View style={[styles.heroSection, { marginTop: spacing.lg }]}>
          <View
            style={[
              styles.emblemOuter,
              shadows.elevated,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                styles.emblemRecessed,
                shadows.recessed,
                { backgroundColor: colors.surfaceRecessed },
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.brand.deepNavy]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emblemCore}
              >
                <Ionicons name="leaf" size={34} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>

          <Text
            style={[
              typography.hero,
              { color: colors.textPrimary, marginTop: spacing.lg },
            ]}
          >
            MindCare
          </Text>
          <Text
            style={[
              typography.body,
              styles.tagline,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            A calm companion for noticing daily digital & activity balance.
          </Text>
        </View>

        {/* Privacy & Purpose Highlights */}
        <SkeuoCard
          variant="elevated"
          style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
        >
          {ONBOARDING_POINTS.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.pointRow,
                index < ONBOARDING_POINTS.length - 1 && {
                  marginBottom: spacing.md,
                  paddingBottom: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.divider,
                },
              ]}
            >
              <View
                style={[
                  styles.pointIconWell,
                  {
                    backgroundColor: colors.primarySoft,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.pointText}>
                <Text style={[typography.h3, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textMuted, marginTop: 2 },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </SkeuoCard>

        {/* Actions */}
        <View style={{ gap: spacing.sm }}>
          <SkeuoButton
            title="Get Started"
            icon="arrow-forward-outline"
            onPress={() => navigation.navigate('Auth', { initialMode: 'signup' })}
          />
          <SkeuoButton
            title="I Already Have an Account"
            variant="secondary"
            onPress={() => navigation.navigate('Auth', { initialMode: 'login' })}
          />
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  themeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
  },
  emblemOuter: {
    width: 108,
    height: 108,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  emblemRecessed: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemCore: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 310,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointIconWell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointText: {
    flex: 1,
  },
});
