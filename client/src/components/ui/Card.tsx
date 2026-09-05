import React from 'react';

interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; padding?: 'sm' | 'md' | 'lg' | 'none'; onClick?: () => void; }

export default function Card({ children, className = '', hover = false, padding = 'md', onClick }: CardProps) {
  const pads = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''} ${pads[padding]} ${className}`}>
      {children}
    </div>
  );
}
