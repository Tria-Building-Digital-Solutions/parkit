/**
 * Customer theme configuration
 */
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

export type CustomerThemeColors = {
  text: string;
  textMuted: string;
  border: string;
  card: string;
  logout: string;
};

function customerColors(isDark: boolean): CustomerThemeColors {
  return {
    text: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#CBD5E1',
    card: isDark ? '#1E293B' : '#FFFFFF',
    logout: '#EF4444',
  };
}

export const customerStaticTokens = {
  radius: { card: 16, button: 14 },
  space: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },
  font: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  fontFamily: {
    primary: 'System',
    secondary: 'System',
  },
} as const;

export function useValetTheme() {
  const systemScheme = useColorScheme();
  const isDark = systemScheme !== 'light';

  return useMemo(
    () => ({
      isDark,
      colors: customerColors(isDark),
      ...customerStaticTokens,
    }),
    [isDark]
  );
}
