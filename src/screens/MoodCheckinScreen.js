import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenContainer,
  ScreenHeader,
  SkeuoButton,
  SkeuoCard,
  SkeuoInput,
} from '../components';
import { useWellness } from '../context/WellnessContext';
import { useTheme } from '../theme';

const MOOD_OPTIONS = [
  { key: 'energized', label: 'Energized', icon: 'sunny-outline', tone: 'positive' },
  { key: 'calm', label: 'Calm', icon: 'leaf-outline', tone: 'positive' },
  { key: 'okay', label: 'Okay', icon: 'partly-sunny-outline', tone: 'neutral' },
  { key: 'tired', label: 'Tired', icon: 'cloudy-night-outline', tone: 'attention' },
  { key: 'stressed', label: 'Stressed', icon: 'rainy-outline', tone: 'important' },
];

/**
 * Optional Daily Mood Check-in Screen.
 * Interactive tactile mood cards + optional note + recent check-in timeline.
 */
export function MoodCheckinScreen() {
  const { colors, shadows, radii, spacing, typography, isDark, toggleTheme } =
    useTheme();
  const { moodLogs, logMood, permissions } = useWellness();

  const [selected, setSelected] = useState(MOOD_OPTIONS[1]);
  const [note, setNote] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const getToneStyle = (tone) => {
    switch (tone) {
      case 'positive':
        return { color: colors.statusPositive, bg: colors.statusPositiveBg };
      case 'attention':
        return { color: colors.statusAttention, bg: colors.statusAttentionBg };
      case 'important':
        return { color: colors.statusImportant, bg: colors.statusImportantBg };
      case 'neutral':
      default:
        return { color: colors.primary, bg: colors.primarySoft };
    }
  };

  const handleSave = () => {
    logMood({
      moodKey: selected.key,
      label: selected.label,
      note,
    });
    setNote('');
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        overline="Optional Check-In"
        title="How Are You Feeling?"
        subtitle="A gentle reflection for your own awareness"
        rightIcon={isDark ? 'sunny-outline' : 'moon-outline'}
        onRightPress={toggleTheme}
      />

      {!permissions.moodCheckIns ? (
        <SkeuoCard variant="recessed" style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyMedium, { color: colors.statusAttention }]}>
            Mood sharing with counselor is currently paused in Consent settings.
            Your reflection stays private on this device.
          </Text>
        </SkeuoCard>
      ) : null}

      {/* Mood Selection Grid */}
      <SkeuoCard variant="elevated" style={{ marginBottom: spacing.md }}>
        <Text
          style={[
            typography.h3,
            { color: colors.textPrimary, marginBottom: spacing.sm },
          ]}
        >
          Pick What Fits Best Right Now
        </Text>

        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((item) => {
            const isSelected = selected.key === item.key;
            const tone = getToneStyle(item.tone);

            return (
              <Pressable
                key={item.key}
                onPress={() => setSelected(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.moodItem,
                  isSelected ? shadows.recessed : shadows.card,
                  {
                    backgroundColor: isSelected ? tone.bg : colors.surface,
                    borderRadius: radii.md,
                    borderWidth: isSelected ? 1.5 : 1,
                    borderColor: isSelected ? tone.color : colors.surfaceBorder,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.moodIconCircle,
                    {
                      backgroundColor: isSelected
                        ? tone.color
                        : colors.surfaceRecessed,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isSelected ? '#FFFFFF' : tone.color}
                  />
                </View>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: isSelected ? tone.color : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '600',
                      marginTop: 6,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SkeuoInput
          label="Optional Note"
          icon="create-outline"
          placeholder="Anything on your mind today? (e.g., exams, sleep, classes)"
          multiline
          value={note}
          onChangeText={setNote}
          style={{ marginTop: spacing.md, marginBottom: spacing.md }}
        />

        <SkeuoButton
          title={`Save "${selected.label}" Check-in`}
          icon="checkmark-circle-outline"
          onPress={handleSave}
        />

        {savedBanner ? (
          <View
            style={[
              styles.savedToast,
              {
                backgroundColor: colors.statusPositiveBg,
                borderRadius: radii.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.statusPositive}
            />
            <Text
              style={[
                typography.caption,
                { color: colors.statusPositive, marginLeft: 8, fontWeight: '700' },
              ]}
            >
              Mood check-in saved!
            </Text>
          </View>
        ) : null}
      </SkeuoCard>

      {/* Recent Check-ins */}
      <SkeuoCard variant="raised">
        <Text
          style={[
            typography.h3,
            { color: colors.textPrimary, marginBottom: spacing.sm },
          ]}
        >
          Recent Check-ins
        </Text>

        {moodLogs.slice(0, 4).map((entry, index) => (
          <View
            key={entry.id}
            style={[
              styles.logRow,
              index < Math.min(moodLogs.length, 4) - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
                paddingBottom: spacing.sm,
                marginBottom: spacing.sm,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.logHeader}>
                <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
                  {entry.label}
                </Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {entry.timestamp}
                </Text>
              </View>
              {entry.note ? (
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textSecondary, marginTop: 2 },
                  ]}
                >
                  {entry.note}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </SkeuoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodItem: {
    width: '30.5%',
    minWidth: 92,
    flexGrow: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
