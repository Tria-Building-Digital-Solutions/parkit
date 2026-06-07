import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface IconEditProps {
  size?: number;
  color?: string;
}

export const IconEdit: React.FC<IconEditProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path 
        d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <Path 
        d="M16 5l3 3" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </Svg>
  );
};
