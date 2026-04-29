import React from 'react';
import GlareHover from './GlareHover';

const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, type = 'button' }) => {
  const baseStyles = 'h-[44px] px-[16px] py-[12px] rounded-[10px] font-medium text-[14px] flex items-center justify-center gap-[8px] transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none';

  const variants = {
    primary: 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]',
    secondary: 'bg-transparent text-[#D1D5DB] border border-[#1F2937] hover:border-[#7C3AED]',
    ghost: 'bg-transparent text-[#9CA3AF] hover:text-[#F9FAFB]',
  };

  const glareColor = variant === 'primary' ? '#ffffff' : '#7C3AED';

  return (
    <GlareHover
      as="button"
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      glareColor={glareColor}
      glareOpacity={0.4}
      glareAngle={-45}
      transitionDuration={600}
    >
      {children}
    </GlareHover>
  );
};

export default Button;
