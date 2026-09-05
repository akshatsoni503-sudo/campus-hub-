import React from 'react';

interface BadgeProps { children: React.ReactNode; variant?: 'default' | 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'lavender'; className?: string; }

const variants = {
  default: 'bg-[#17105F] text-white',
  blue: 'bg-[#1769E0]/10 text-[#1769E0] border border-[#1769E0]/20',
  green: 'bg-green-100 text-green-700 border border-green-200',
  red: 'bg-red-100 text-red-700 border border-red-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  lavender: 'bg-[#F5F3FF] text-[#17105F] border border-[#E9E5FF]',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
}
