/**
 * MindCare Soft Skeuomorphic & Neumorphic Depth Presets
 *
 * Android uses `elevation` for cast shadows, while iOS uses `shadow*` props.
 * Combining soft shadows with subtle top-edge borders gives realistic tactile depth
 * without heavy, distracting drop shadows.
 */

export function getShadows(colors) {
  const isDark = colors.mode === 'dark';

  return {
    // Softly raised card (default for content cards)
    card: {
      elevation: isDark ? 6 : 5,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.42 : 0.10,
      shadowRadius: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },

    // Higher elevation for hero cards, floating nav, or prominent stats
    elevated: {
      elevation: isDark ? 10 : 9,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.50 : 0.14,
      shadowRadius: 20,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },

    // Tactile button shadow (reduces when pressed)
    button: {
      elevation: isDark ? 5 : 4,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.40 : 0.18,
      shadowRadius: 8,
    },

    buttonPressed: {
      elevation: 1,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 3,
    },

    // Pressed-in neumorphic well (inputs, stat wells, inactive toggle tracks)
    recessed: {
      elevation: 0,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
  };
}
