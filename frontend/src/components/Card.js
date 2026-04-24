import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#111827] p-[24px] rounded-[16px] border border-[#1F2937] shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
