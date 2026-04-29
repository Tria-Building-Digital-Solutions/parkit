---
status: Draft
authors:
  - name: Your Name
    email: your.email@example.com
created: 2026-04-28
updated: 2026-04-28
---

# Design Document

## Overview
This document describes the theme system architecture for Parkit, covering both web and mobile platforms. It defines the color palette, typography, spacing, and accessibility guidelines to ensure consistency across the application.

## Background
Parkit uses a custom theme system to maintain visual consistency between web (Next.js) and mobile (React Native) applications. The theme is aligned with the Parkit logo colors and supports both light and dark modes across platforms.

## Goals
- Maintain visual consistency between web and mobile platforms
- Provide a unified color palette aligned with the Parkit brand
- Support light and dark modes with automatic system preference detection
- Ensure accessibility compliance with proper contrast ratios
- Define reusable design tokens (spacing, typography, icons)

## Non-Goals
- Supporting custom user-defined color schemes beyond light/dark
- Implementing theme switching per-company (currently not supported)
- Providing multiple brand themes

## Proposed Solution

### Color Palette

#### Primary Colors
- **Light Mode**: `#2563eb` (blue-600) - matches Parkit logo "it." in light mode
- **Dark Mode**: `#3b82f6` (blue-500) - matches Parkit logo "it." in dark mode
- **Accent**: `#3B82F6` - used consistently across both platforms

#### Secondary Colors (Neutrals)
- **Light Mode**: `#64748b` (slate-500) for secondary text
- **Dark Mode**: `#94a3b8` (slate-400) for secondary text

#### Tertiary Colors (Subtle)
- **Light Mode**: `#94a3b8` (slate-400) for muted elements
- **Dark Mode**: `#cbd5e1` (slate-300) for muted elements

### Platform-Specific Implementations

#### Web (Next.js)
- Uses `next-themes` for theme management
- Colors defined in `apps/web/src/lib/themeDefaults.ts`
- Matches `globals.css` CSS variables
- Theme provider wrapper in `apps/web/src/components/ThemeProvider.tsx`

#### Mobile (React Native)
- Custom theme system in `apps/mobile/mobile-valet/src/theme/valetTheme.ts`
- Zustand store for theme preference persistence in `apps/mobile/mobile-valet/src/lib/themeStore.ts`
- Supports three modes: `system`, `light`, `dark`
- Uses `useColorScheme` from React Native for system detection
- Persists preference using `expo-secure-store`

### Design Tokens

#### Typography Scale (Mobile)
- `xs`: 10px - Small labels, captions
- `sm`: 12px - Secondary text, helper text
- `base`: 14px - Body text, standard
- `md`: 16px - Emphasized body, subtitles
- `lg`: 18px - Important text, card titles
- `xl`: 20px - Section headers
- `xxl`: 24px - Page titles
- `xxxl`: 28px - Hero titles

#### Accessibility Typography (Mobile - Tickets)
- `title`: 34px
- `hero`: 34px
- `body`: 20px
- `button`: 22px
- `secondary`: 18px
- `status`: 18px

#### Spacing
- `xs`: 8px
- `sm`: 12px
- `md`: 16px
- `lg`: 20px
- `xl`: 24px
- `xxl`: 32px

#### Icon Sizes
- `xs`: 12px
- `sm`: 16px
- `md`: 20px
- `lg`: 24px
- `xl`: 28px
- `xxl`: 36px

#### Border Radius
- Card: 16px
- Button: 14px

#### Minimum Touch Target
- Standard: 56px
- Accessibility (tickets): 60px

### Theme Behavior

#### Mobile Theme Logic
- If preference is `dark` → use dark theme
- If preference is `light` → use light theme
- If preference is `system` or `null` → use dark theme (default to dark for valet app)
- System scheme detection via `useColorScheme()`

#### Color Schemes

**Dark Mode Backgrounds:**
- Auth screen: `#020617` (slate-950)
- Card: `#1E293B` (slate-800)
- Input: `#1E293B` (slate-800)

**Light Mode Backgrounds:**
- Auth screen: `#FFFFFF`
- Card: `#FFFFFF`
- Input: `#FFFFFF`

### Status Colors

Status-specific colors for ticket states:

| Status | Light Mode Bar | Dark Mode Bar |
|--------|---------------|---------------|
| Assigned | `#EA580C` | `#FB923C` |
| In-Transit | `#3B82F6` | `#3B82F6` |
| Completed | `#047857` | `#34D399` |

## Alternatives Considered
- **Using a third-party theme library**: Rejected to maintain full control over brand colors and reduce bundle size
- **CSS-in-JS for mobile**: Rejected in favor of React Native StyleSheet for better performance
- **Separate theme files per screen**: Rejected in favor of centralized theme tokens for consistency

## Testing Plan
- Verify color contrast ratios meet WCAG AA standards
- Test theme switching persistence across app restarts
- Validate responsive layout calculations on different screen sizes
- Test accessibility font sizes on actual devices

## Rollout Plan
- Theme system is already implemented in both platforms
- Future updates should maintain backward compatibility with existing color tokens
- New color additions should follow the established naming convention

## Performance Considerations
- Mobile theme uses `useMemo` to prevent unnecessary recalculations
- Theme preference is persisted securely on mobile using expo-secure-store
- Static tokens are defined as constants to avoid recreation

## Security Considerations
- Theme preference on mobile is stored using expo-secure-store (encrypted storage)
- No sensitive data is exposed through theme configuration

## References
- Web theme: `apps/web/src/lib/themeDefaults.ts`
- Web theme provider: `apps/web/src/components/ThemeProvider.tsx`
- Mobile theme: `apps/mobile/mobile-valet/src/theme/valetTheme.ts`
- Mobile theme store: `apps/mobile/mobile-valet/src/lib/themeStore.ts`
