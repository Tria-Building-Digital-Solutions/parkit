import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface IconSaveProps {
  size?: number;
  color?: string;
}

export const IconSave: React.FC<IconSaveProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path 
        d="M19 21h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h5l4 4v13a2 2 0 0 1 -2 2z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M17 21v-7h-10v7" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M7 3v4a1 1 0 0 0 1 1h4" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </Svg>
  );
};
