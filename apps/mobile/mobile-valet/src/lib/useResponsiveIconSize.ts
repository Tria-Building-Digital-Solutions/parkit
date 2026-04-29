
/**
 * Hook to get responsive icon sizes
 * @param baseSize - Base icon size (default 24)
 * @returns Scaled icon size and stroke width
 */
export function useResponsiveIconSize(baseSize: number = 24) {
  
  const size = baseSize;
  const strokeWidth = 2;
  
  return { size, strokeWidth };
}
