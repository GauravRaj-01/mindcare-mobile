/**
 * MindCare Color System
 *
 * Calming wellness palette supporting both Light (Warm Ivory base)
 * and Dark (Deep Navy base) themes while keeping the same brand identity.
 */

export const brandPalette = {
  deepNavy: '#172B40',
  mutedTeal: '#3C8580',
  softMint: '#A8D5BE',
  warmIvory: '#F3F0E8',
  mutedGold: '#D6A85F',
  slate: '#263442',
};

export const lightColors = {
  mode: 'light',
  brand: brandPalette,

  // Layered surfaces for Soft Skeuomorphism & Neumorphism
  background: '#F3F0E8',          // Warm Ivory main canvas
  backgroundSecondary: '#ECE7DC', // Subtle gradient end / secondary canvas
  surface: '#F9F7F1',             // Raised card surface
  surfaceElevated: '#FCFBF8',     // Higher floating card / modal surface
  surfaceRecessed: '#E7E2D5',     // Pressed-in neumorphic well / input background
  surfaceHighlight: 'rgba(255, 255, 255, 0.90)',
  surfaceBorder: 'rgba(255, 255, 255, 0.78)',
  surfaceBorderSubtle: 'rgba(23, 43, 64, 0.08)',

  // Minimal Glassmorphism surfaces
  glassBackground: 'rgba(249, 247, 241, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',

  // Typography
  textPrimary: '#172B40',         // Deep Navy Blue
  textSecondary: '#263442',       // Slate
  textMuted: '#5B6B7A',
  textOnAccent: '#FFFFFF',

  // Interactive accents
  primary: '#3C8580',             // Muted Teal
  primaryPressed: '#2F6E6A',
  primarySoft: '#DCEEE5',         // Soft Mint tint for active badges/pills
  secondary: '#172B40',           // Deep Navy
  accentMint: '#A8D5BE',
  accentGold: '#D6A85F',

  // Status colors (non-alarming, wellness-oriented)
  statusPositive: '#4C9A74',
  statusPositiveBg: '#E3F2EA',
  statusAttention: '#C88D36',
  statusAttentionBg: '#F9EEDB',
  statusImportant: '#C96A62',
  statusImportantBg: '#F8E5E3',
  statusNeutral: '#768491',
  statusNeutralBg: '#E7EAED',

  // Shadow & depth helpers
  shadowDark: '#172B40',
  shadowLight: '#FFFFFF',
  divider: 'rgba(23, 43, 64, 0.10)',
};

export const darkColors = {
  mode: 'dark',
  brand: brandPalette,

  // Layered Deep Navy & Slate surfaces
  background: '#112132',          // Deep Navy canvas
  backgroundSecondary: '#0D1A28', // Deeper gradient end
  surface: '#1A2F44',             // Raised Soft Skeuomorphic card
  surfaceElevated: '#213952',     // Elevated modal / top card
  surfaceRecessed: '#132436',     // Pressed-in well / input background
  surfaceHighlight: 'rgba(255, 255, 255, 0.10)',
  surfaceBorder: 'rgba(255, 255, 255, 0.10)',
  surfaceBorderSubtle: 'rgba(0, 0, 0, 0.28)',

  // Minimal Glassmorphism surfaces
  glassBackground: 'rgba(26, 47, 68, 0.72)',
  glassBorder: 'rgba(168, 213, 190, 0.22)',

  // Typography
  textPrimary: '#F3F0E8',         // Warm Ivory on dark
  textSecondary: '#C8D3DC',
  textMuted: '#8FA2B2',
  textOnAccent: '#FFFFFF',

  // Interactive accents
  primary: '#4AA19B',             // Slightly brighter Muted Teal for dark contrast
  primaryPressed: '#3B847F',
  primarySoft: 'rgba(168, 213, 190, 0.16)',
  secondary: '#A8D5BE',           // Soft Mint Green
  accentMint: '#A8D5BE',
  accentGold: '#D6A85F',

  // Status colors
  statusPositive: '#68BC92',
  statusPositiveBg: 'rgba(104, 188, 146, 0.16)',
  statusAttention: '#E0AA54',
  statusAttentionBg: 'rgba(224, 170, 84, 0.16)',
  statusImportant: '#DF827A',
  statusImportantBg: 'rgba(223, 130, 122, 0.16)',
  statusNeutral: '#96A4B0',
  statusNeutralBg: 'rgba(150, 164, 176, 0.16)',

  // Shadow & depth helpers
  shadowDark: '#060E16',
  shadowLight: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(243, 240, 232, 0.10)',
};
