import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme';

/**
 * Wraps every MindCare screen with a calming layered gradient canvas,
 * safe-area insets (status bar / gesture bar), and consistent horizontal padding.
 */
export function ScreenContainer({
  children,
  scrollable = true,
  edges = ['top', 'left', 'right'],
  contentStyle,
  style,
}) {
  const { colors, isDark, layout, spacing } = useTheme();

  const innerContent = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: layout.screenPadding,
          paddingBottom: spacing.xxxl,
        },
        contentStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.staticContent,
        { paddingHorizontal: layout.screenPadding },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={[styles.gradient, style]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView edges={edges} style={styles.safeArea}>
        {innerContent}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
  },
  staticContent: {
    flex: 1,
    paddingTop: 12,
  },
});
