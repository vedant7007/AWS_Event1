import React from 'react';
import BorderGlow from './BorderGlow';

const Card = ({ children, className = '' }) => {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="261 83 58"
      backgroundColor="#111827"
      borderRadius={16}
      glowRadius={30}
      glowIntensity={0.8}
      coneSpread={25}
      animated={true}
      className={`p-[24px] border border-[#1F2937] shadow-sm ${className}`}
      colors={['#7C3AED', '#3b82f6', '#c084fc']}
    >
      {children}
    </BorderGlow>
  );
};

export default Card;
