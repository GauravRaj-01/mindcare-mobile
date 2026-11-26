import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GlassPanel,
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoToggle,
} from '../components';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

const PERMISSION_ITEMS = [
  {
    key: 'usageAccess',
    title: 'App Usage & Screen Time',
    description:
      'Daily app-category totals via Android UsageStatsManager. Never reads screen content or messages.',
    icon: 'phone-portrait-outline',
  },
  {
    key: 'healthConnect',
    title: 'Steps & Active Minutes',
    description:
      'Daily step counts and movement minutes via Android Health Connect.',
    icon: 'footsteps-outline',
  },
  {
    key: 'moodCheckIns',
    title: 'Optional Mood Check-ins',
    description:
      'Share your self-logged mood entries with your assigned counselor.',
    icon: 'heart-outline',
  },
  {
    key: 'backgroundSync',
    title: 'Periodic Background Sync',
    description:
      'Uploads daily summaries securely when battery & network allow.',
    icon: 'cloud-upload-outline',
  },
];

/**
 * Consent & Permissions Screen
 * Gives students transparent, granular control to enable, pause, or revoke tracking.
 */
export function ConsentScreen({ navigation }) {
  const {
    permissions,
    isCollectionPaused,
    togglePermission,
    togglePauseAll,
    revokeAllPermissions,
  } = useWellness();

  const { colors, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();

  const handleRevokeConfirm = () => {
    Alert.alert(
      'Revoke All Data Permissions?',
      'This will turn off all data collection toggles and pause synchronization immediately. You can re-enable them anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke All',
          style: 'destructive',
          onPress: revokeAllPermissions,
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="Privacy & Control"
        title="Consent & Permissions"
        subtitle="You decide what MindCare collects"
        onBack={() => navigation.goBack()}
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      {/* Privacy Promise Glass Notice */}
      <GlassPanel style={{ marginBottom: spacing.md }}>
        <View style={styles.promiseHeader}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.primary}
          />
          <Text
            style={[
              typography.h3,
              { color: colors.textPrimary, marginLeft: 8 },
            ]}
          >
            What We Never Collect
          </Text>
        </View>
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: 6, lineHeight: 19 },
          ]}
        >
          MindCare never reads messages, contacts, call recordings, passwords, or
          continuous GPS location. Indicators only help counselors spot routine
          shifts—never to diagnose any medical condition.
        </Text>
      </GlassPanel>

      {/* Master Pause Control */}
      <SkeuoCard
        variant="elevated"
        style={{
          marginBottom: spacing.md,
          borderColor: isCollectionPaused
            ? colors.statusAttention
            : colors.surfaceBorder,
        }}
      >
        <View style={styles.rowBetween}>
          <View style={styles.textBlock}>
            <Text style={[typography.h3, { color: colors.textPrimary }]}>
              Pause All Data Collection
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, marginTop: 2 },
              ]}
            >
              {isCollectionPaused
                ? 'Collection & background sync are currently paused.'
                : 'Temporarily stop syncing without losing your account.'}
            </Text>
          </View>
          <SkeuoToggle
            value={isCollectionPaused}
            onValueChange={togglePauseAll}
            accessibilityLabel="Pause all data collection"
          />
        </View>
      </SkeuoCard>

      {/* Granular Permission Toggles */}
      <SkeuoCard variant="raised" style={{ marginBottom: spacing.lg }}>
        <Text
          style={[
            typography.h3,
            { color: colors.textPrimary, marginBottom: spacing.md },
          ]}
        >
          Individual Permissions
        </Text>

        {PERMISSION_ITEMS.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.permissionRow,
              index < PERMISSION_ITEMS.length - 1 && {
                marginBottom: spacing.md,
                paddingBottom: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: permissions[item.key]
                    ? colors.primarySoft
                    : colors.surfaceRecessed,
                  borderRadius: radii.sm,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={
                  permissions[item.key] ? colors.primary : colors.textMuted
                }
              />
            </View>

            <View style={styles.textBlock}>
              <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
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

            <SkeuoToggle
              value={permissions[item.key]}
              onValueChange={() => togglePermission(item.key)}
              accessibilityLabel={`Toggle ${item.title}`}
            />
          </View>
        ))}
      </SkeuoCard>

      {/* Visible Revoke Option */}
      <SkeuoButton
        title="Revoke All Permissions"
        variant="secondary"
        icon="close-circle-outline"
        onPress={handleRevokeConfirm}
        textStyle={{ color: colors.statusImportant }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  promiseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
});
