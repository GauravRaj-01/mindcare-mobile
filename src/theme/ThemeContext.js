import { createContext, useContext, useMemo, useState } from 'react';
import { darkColors, lightColors } from './colors';
import { getShadows } from './shadows';
import { layout, radii, spacing } from './spacing';
import { typography } from './typography';

const ThemeContext = createContext(null);

/**
 * Provides MindCare design tokens (light/dark colors, shadows, spacing, typography)
 * to every screen and reusable component.
 */
export function ThemeProvider({ children, initialMode = 'light' }) {
  const [mode, setMode] = useState(initialMode);

  const value = useMemo(() => {
    const colors = mode === 'dark' ? darkColors : lightColors;
    const shadows = getShadows(colors);

    return {
      mode,
      isDark: mode === 'dark',
      colors,
      shadows,
      spacing,
      radii,
      layout,
      typography,
      setThemeMode: setMode,
      toggleTheme: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook to read the active MindCare theme inside any component.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
}
