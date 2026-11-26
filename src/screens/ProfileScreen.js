import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoToggle,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Profile & Settings Screen
 * Displays student account card, privacy/consent entry, theme preference,
 * sync controls, and sign out.
 */
export function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const {
    permissions,
    isCollectionPaused,
    lastSyncedAt,
    isSyncing,
    triggerSync,
  } = useWellness();

  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();

  const activePermissionCount = Object.values(permissions).filter(Boolean).length;

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="Account & Preferences"
        title="Profile & Settings"
        subtitle="Manage privacy, theme, and sync"
      />

      {/* Premium Profile Card */}
      <SkeuoCard variant="elevated" style={{ marginBottom: spacing.md }}>
        <View style={styles.profileRow}>
          <View
            style={[
              styles.avatarFrame,
              shadows.card,
              {
                backgroundColor: colors.surfaceRecessed,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, colors.brand.deepNavy]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarCore}
            >
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </LinearGradient>
          </View>

          <View style={styles.profileMeta}>
            <Text style={[typography.h2, { color: colors.textPrimary }]}>
              {user?.name || 'Student'}
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
              {user?.email}
            </Text>

            <View style={[styles.badgeRow, { marginTop: spacing.xs }]}>
              <View
                style={[
                  styles.pill,
                  { backgroundColor: colors.primarySoft, borderRadius: radii.pill },
                ]}
              >
                <Text style={[styles.pillText, { color: colors.primary }]}>
                  {user?.universityId || 'STU-2026-001'}
                </Text>
              </View>
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: colors.surfaceRecessed,
                    borderRadius: radii.pill,
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                  {user?.provider === 'google' ? 'Google Account' : 'Email Account'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SkeuoCard>

      {/* Privacy & Consent Navigation Card */}
      <Pressable
        onPress={() => navigation.navigate('Consent')}
        accessibilityRole="button"
        accessibilityLabel="Open Consent and Permissions"
        style={({ pressed }) => [
          {
            marginBottom: spacing.md,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <SkeuoCard variant="raised">
          <View style={styles.rowBetween}>
            <View style={styles.leftIconRow}>
              <View
                style={[
                  styles.settingIcon,
                  {
                    backgroundColor: colors.primarySoft,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h3, { color: colors.textPrimary }]}>
                  Consent & Permissions
                </Text>
                <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                  {isCollectionPaused
                    ? 'Collection paused'
                    : `${activePermissionCount} of 4 permissions enabled`}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </View>
        </SkeuoCard>
      </Pressable>

      {/* Appearance & Sync Controls */}
      <SkeuoCard variant="raised" style={{ marginBottom: spacing.lg }}>
        <View
          style={[
            styles.rowBetween,
            {
              paddingBottom: spacing.md,
              marginBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            },
          ]}
        >
          <View style={styles.leftIconRow}>
            <View
              style={[
                styles.settingIcon,
                {
                  backgroundColor: colors.surfaceRecessed,
                  borderRadius: radii.sm,
                },
              ]}
            >
              <Ionicons
                name={isDark ? 'moon-outline' : 'sunny-outline'}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.textPrimary }]}>
                Dark Theme
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                {isDark ? 'Deep Navy night mode active' : 'Warm Ivory day mode active'}
              </Text>
            </View>
          </View>

          <SkeuoToggle
            value={isDark}
            onValueChange={toggleTheme}
            accessibilityLabel="Toggle dark theme"
          />
        </View>

        <View style={styles.syncBlock}>
          <View style={styles.leftIconRow}>
            <View
              style={[
                styles.settingIcon,
                {
                  backgroundColor: colors.surfaceRecessed,
                  borderRadius: radii.sm,
                },
              ]}
            >
              <Ionicons
                name="cloud-done-outline"
                size={20}
                color={
                  isCollectionPaused
                    ? colors.statusAttention
                    : colors.statusPositive
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.textPrimary }]}>
                Data Synchronization
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                Last successful sync: {lastSyncedAt}
              </Text>
            </View>
          </View>

          <SkeuoButton
            title={isSyncing ? 'Syncing...' : 'Sync Now'}
            variant="secondary"
            icon="sync-outline"
            loading={isSyncing}
            disabled={isCollectionPaused}
            onPress={triggerSync}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </SkeuoCard>

      {/* Sign Out */}
      <SkeuoButton
        title="Sign Out"
        variant="navy"
        icon="log-out-outline"
        onPress={signOut}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarFrame: {
    width: 72,
    height: 72,
    borderRadius: 24,
    padding: 5,
    borderWidth: 1,
    marginRight: 16,
  },
  avatarCore: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIconRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  syncBlock: {
    width: '100%',
  },
});
