import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

/**
 * Responsive scaling system for mobile-valet
 * Scales fonts, icons, paddings, and other dimensions based on:
 * - Screen size (tablet vs phone)
 * - Platform-specific adjustments
 */
export function useResponsiveScale() {
  const { width, height } = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const isTablet = shortestSide >= 600;
  const isLargePhone = shortestSide >= 400 && shortestSide < 600;

  return useMemo(() => {
    // Screen size factor
    const screenScale = isTablet ? 1.15 : isLargePhone ? 1.05 : 1.0;
    
    // Platform-specific adjustments
    const platformScale = Platform.OS === 'android' ? 0.97 : 1.0;
    
    // Final scale factor
    const finalScale = screenScale * platformScale;

    /**
     * Scale a dimension value
     * @param value - Base dimension value
     * @param min - Minimum value to prevent too small elements
     * @param max - Maximum value to prevent too large elements
     */
    const scaleDimension = (value: number, min?: number, max?: number): number => {
      const scaled = value * finalScale;
      if (min !== undefined && scaled < min) return min;
      if (max !== undefined && scaled > max) return max;
      return Math.round(scaled);
    };

    /**
     * Scale font size
     * @param value - Base font size
     * @param min - Minimum font size (default 10)
     * @param max - Maximum font size (default 40)
     */
    const scaleFont = (value: number, min: number = 10, max: number = 40): number => {
      const scaled = value * screenScale * platformScale;
      if (scaled < min) return min;
      if (scaled > max) return max;
      return Math.round(scaled);
    };

    /**
     * Scale icon size
     * @param value - Base icon size
     * @param min - Minimum icon size (default 16)
     * @param max - Maximum icon size (default 64)
     */
    const scaleIcon = (value: number, min: number = 16, max: number = 64): number => {
      const scaled = value * finalScale;
      if (scaled < min) return min;
      if (scaled > max) return max;
      return Math.round(scaled);
    };

    /**
     * Scale padding/margin
     * @param value - Base spacing value
     * @param min - Minimum spacing (default 4)
     * @param max - Maximum spacing (default 48)
     */
    const scaleSpacing = (value: number, min: number = 4, max: number = 48): number => {
      const scaled = value * finalScale;
      if (scaled < min) return min;
      if (scaled > max) return max;
      return Math.round(scaled);
    };

    /**
     * Scale border radius
     * @param value - Base border radius
     * @param min - Minimum radius (default 4)
     * @param max - Maximum radius (default 32)
     */
    const scaleRadius = (value: number, min: number = 4, max: number = 32): number => {
      const scaled = value * finalScale;
      if (scaled < min) return min;
      if (scaled > max) return max;
      return Math.round(scaled);
    };

    /**
     * Scale stroke width for icons
     * @param value - Base stroke width
     * @param min - Minimum stroke (default 1)
     * @param max - Maximum stroke (default 4)
     */
    const scaleStroke = (value: number, min: number = 1, max: number = 4): number => {
      const scaled = value * finalScale;
      if (scaled < min) return min;
      if (scaled > max) return max;
      return Math.round(scaled * 10) / 10; // Keep 1 decimal
    };

    /**
     * Minimum touch target for accessibility (44pt recommended)
     */
    const minTouchTarget = scaleDimension(44, 44, 64);

    return {
      scale: finalScale,
      screenScale,
      isTablet,
      isLargePhone,
      scaleDimension,
      scaleFont,
      scaleIcon,
      scaleSpacing,
      scaleRadius,
      scaleStroke,
      minTouchTarget,
    };
  }, [isTablet, isLargePhone]);
}
