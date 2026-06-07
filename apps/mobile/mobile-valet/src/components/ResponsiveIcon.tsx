import React from 'react';
import { useResponsiveIconSize } from '@/lib/useResponsiveIconSize';

interface ResponsiveIconProps {
  IconComponent: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  baseSize?: number;
  color?: string;
  strokeWidth?: number;
  [key: string]: any;
}

/**
 * Wrapper component to make any icon responsive
 * Automatically scales icon size and stroke width based on accessibility settings and screen size
 */
export function ResponsiveIcon({ 
  IconComponent, 
  baseSize = 24, 
  color, 
  strokeWidth: customStrokeWidth,
  ...props 
}: ResponsiveIconProps) {
  const { size, strokeWidth: defaultStrokeWidth } = useResponsiveIconSize(baseSize);
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={customStrokeWidth ?? defaultStrokeWidth}
      {...props} 
    />
  );
}
