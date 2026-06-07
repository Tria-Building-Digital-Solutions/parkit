/**
 * Valet theme: light only if system is explicitly `light`.
 * If `dark`, `null` or indeterminate → dark theme (background #020617, etc.).
 */
import type { ViewStyle } from "react-native";
import { useColorScheme, useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { useThemeStore } from "@/lib/themeStore";

/** Same blue as welcome.btnPrimary */
export const ACCENT = "#3B82F6";
/** Same as welcome.btnSecondary (light mode) */
export const SIGNUP_BG_LIGHT = "#0F172A";
/** Registration in dark mode: contrast over dark bottom sheet */
export const SIGNUP_BG_DARK = "#475569";

export type AuthThemeColors = {
  /** Background of the entire auth/splash screen (same dark slate as the web in hero). */
  authScreenChromeBg: string;
  /** Top area logo + «valet»; same color as the rest of the background. */
  authHeroStripBg: string;
  /** Controls over the dark strip (back, etc.). */
  authHeroBackBtnBg: string;
  authHeroBackBtnIcon: string;
  /** Text «valet» under the logo in the dark strip. */
  authHeroValetLabel: string;
  /** Only light theme: top border of the form sheet (separation from the hero). */
  authFormSheetSeparator: Pick<ViewStyle, "borderTopWidth" | "borderTopColor">;
  bottomSheet: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  inputBorder: string;
  inputBg: string;
  placeholder: string;
  backBtnBg: string;
  backBtnIcon: string;
  btnLoginBg: string;
  btnLoginText: string;
  btnSignupBg: string;
  btnSignupText: string;
  linkAccent: string;
  errorBg: string;
  errorText: string;
  modalSheet: string;
  modalBackdrop: string;
  modalOptionActive: string;
  statusBarStyle: "light-content" | "dark-content";
  statusBarBg: string;
};

export type HomeThemeColors = {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  primary: string;
  primaryPressed: string;
  success: string;
  successPressed: string;
  warning: string;
  logout: string;
  white: string;
};

function authColors(isDark: boolean): AuthThemeColors {
  return {
    authScreenChromeBg: "#020617",
    authHeroStripBg: "#020617",
    authHeroBackBtnBg: isDark ? "rgba(248, 250, 252, 0.12)" : "rgba(15, 23, 42, 0.12)",
    authHeroBackBtnIcon: isDark ? "#F8FAFC" : "#0F172A",
    authHeroValetLabel: isDark ? "rgba(148, 163, 184, 0.58)" : "rgba(71, 85, 105, 0.9)",
    bottomSheet: isDark ? "#0F172A" : "#FFFFFF",
    text: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#475569",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    inputBorder: isDark ? "#334155" : "#E2E8F0",
    inputBg: isDark ? "#1E293B" : "#FFFFFF",
    placeholder: "#94A3B8",
    backBtnBg: isDark ? "rgba(248, 250, 252, 0.12)" : "rgba(15, 23, 42, 0.08)",
    /** Inputs / UI on the sheet (not on the dark strip). */
    backBtnIcon: isDark ? "#F8FAFC" : "#0F172A",
    btnLoginBg: ACCENT,
    btnLoginText: "#FFFFFF",
    btnSignupBg: isDark ? SIGNUP_BG_DARK : SIGNUP_BG_LIGHT,
    btnSignupText: "#FFFFFF",
    linkAccent: ACCENT,
    errorBg: isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.1)",
    errorText: "#EF4444",
    modalSheet: isDark ? "#1E293B" : "#FFFFFF",
    modalBackdrop: "rgba(15, 23, 42, 0.5)",
    modalOptionActive: isDark ? "rgba(59, 130, 246, 0.22)" : "rgba(59, 130, 246, 0.08)",
    /** Auth/splash screens: bar over dark strip. */
    statusBarStyle: "light-content",
    statusBarBg: "#020617",
    authFormSheetSeparator: isDark
      ? { borderTopWidth: 0, borderTopColor: "transparent" }
      : { borderTopWidth: 1, borderTopColor: "#E2E8F0" },
  };
}

function homeColors(isDark: boolean): HomeThemeColors {
  if (isDark) {
    return {
      bg: "#0F172A",
      card: "#1E293B",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      textSubtle: "#64748B",
      border: "#334155",
      primary: ACCENT,
      primaryPressed: "#2563EB",
      success: "#10B981",
      successPressed: "#059669",
      warning: "#F97316",
      logout: "#F87171",
      white: "#FFFFFF",
    };
  }
  return {
    bg: "#FFFFFF",
    card: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#475569",
    textSubtle: "#64748B",
    border: "#CBD5E1",
    primary: ACCENT,
    primaryPressed: "#2563EB",
    success: "#047857",
    successPressed: "#065F46",
    warning: "#C2410C",
    logout: "#B91C1C",
    white: "#FFFFFF",
  };
}

// Standardized font scale - consistent across platforms
// Base scale: optimized for mobile with proper readability
const FONT_SCALE = {
  xs: 10,    // Small labels, captions
  sm: 12,    // Secondary text, helper text
  base: 14,  // Body text, standard
  md: 16,    // Emphasized body, subtitles
  lg: 18,    // Important text, card titles
  xl: 20,    // Section headers
  xxl: 24,   // Page titles
  xxxl: 28,  // Hero titles
} as const;

export const valetStaticTokens = {
  minTouch: 56,
  radius: { card: 16, button: 14 },
  space: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },
  font: {
    // Standardized sizes
    xs: FONT_SCALE.xs,
    sm: FONT_SCALE.sm,
    base: FONT_SCALE.base,
    md: FONT_SCALE.md,
    lg: FONT_SCALE.lg,
    xl: FONT_SCALE.xl,
    xxl: FONT_SCALE.xxl,
    xxxl: FONT_SCALE.xxxl,
  },
  fontFamily: {
    primary: "System",
    secondary: "System",
  } as const,
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 36,
  },
} as const;


export const ticketsA11y = {
  minTouch: 60,
  font: {
    title: 34,
    subtitle: 20,
    hero: 34,
    body: 20,
    secondary: 18,
    button: 22,
    status: 18,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 34,
  },
} as const;

export function useValetTheme() {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((s) => s.preference);
  const isDark =
    preference === "dark"
      ? true
      : preference === "light"
        ? false
        : systemScheme !== "light";

  return useMemo(
    () => ({
      isDark,
      auth: authColors(isDark),
      colors: homeColors(isDark),
      ...valetStaticTokens,
      font: valetStaticTokens.font,
      a11yFont: ticketsA11y.font,
    }),
    [isDark]
  );
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const isTablet = shortestSide >= 600;
  const isLandscape = width > height;

  return useMemo(
    () => ({
      width,
      height,
      shortestSide,
      isTablet,
      isLandscape,
      contentMaxWidth: width,
      formMaxWidth: width,
      horizontalPadding: isTablet ? 36 : 20,
      sectionPadding: isTablet ? 28 : 20,
    }),
    [height, isLandscape, isTablet, shortestSide, width]
  );
}

export function statusVisuals(
  status: "assigned" | "in-transit" | "completed",
  isDark: boolean
) {
  if (isDark) {
    switch (status) {
      case "assigned":
        return { bar: "#FB923C", softBg: "rgba(251, 146, 60, 0.2)", softText: "#FDBA74" };
      case "in-transit":
        return { bar: ACCENT, softBg: "rgba(59, 130, 246, 0.2)", softText: "#93C5FD" };
      case "completed":
        return { bar: "#34D399", softBg: "rgba(52, 211, 153, 0.2)", softText: "#6EE7B7" };
      default:
        return { bar: "#94A3B8", softBg: "rgba(148, 163, 184, 0.15)", softText: "#CBD5E1" };
    }
  }
  switch (status) {
    case "assigned":
      return { bar: "#EA580C", softBg: "#FFEDD5", softText: "#9A3412" };
    case "in-transit":
      return { bar: ACCENT, softBg: "#DBEAFE", softText: "#1E40AF" };
    case "completed":
      return { bar: "#047857", softBg: "#D1FAE5", softText: "#065F46" };
    default:
      return { bar: "#64748B", softBg: "#F1F5F9", softText: "#0F172A" };
  }
}
