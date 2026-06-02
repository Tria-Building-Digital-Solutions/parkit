/**
 * Default theme colors, aligned with the Parkit logo:
 * - Primary: blue from the "it." (blue-600 light, blue-500 dark).
 * - Secondary/Tertiary: slate neutrals for text and soft backgrounds.
 * Matches globals.css (:root and .dark).
 */
export const THEME_DEFAULT_PRIMARY_LIGHT = "#2563eb";
export const THEME_DEFAULT_PRIMARY_DARK = "#3b82f6";
export const THEME_DEFAULT_SECONDARY_LIGHT = "#3d4a5c";
export const THEME_DEFAULT_SECONDARY_DARK = "#b8c2d4";
export const THEME_DEFAULT_TERTIARY_LIGHT = "#8896ab";
export const THEME_DEFAULT_TERTIARY_DARK = "#6a7893";

export function getThemeDefaultColors(isDark: boolean) {
  return {
    primary: isDark ? THEME_DEFAULT_PRIMARY_DARK : THEME_DEFAULT_PRIMARY_LIGHT,
    secondary: isDark ? THEME_DEFAULT_SECONDARY_DARK : THEME_DEFAULT_SECONDARY_LIGHT,
    tertiary: isDark ? THEME_DEFAULT_TERTIARY_DARK : THEME_DEFAULT_TERTIARY_LIGHT,
  };
}
