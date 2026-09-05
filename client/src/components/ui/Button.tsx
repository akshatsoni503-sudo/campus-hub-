import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({ variant = 'primary', size = 'md', loading, icon, fullWidth, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#17105F] text-white hover:bg-[#1a1370] shadow-md hover:shadow-lg',
    secondary: 'bg-[#1769E0] text-white hover:bg-[#1558c0] shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#17105F] text-[#17105F] hover:bg-[#17105F] hover:text-white',
    ghost: 'text-[#17105F] hover:bg-[#F5F3FF]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
  };
  const sizes = { sm: 'px-4 py-1.5 text-sm', md: 'px-6 py-2.5 text-sm', lg: 'px-8 py-3 text-base' };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
