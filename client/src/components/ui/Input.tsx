import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#1769E0] focus:ring-2 focus:ring-[#1769E0]/20 outline-none transition-all text-sm ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`} {...props} />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <textarea className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#1769E0] focus:ring-2 focus:ring-[#1769E0]/20 outline-none transition-all text-sm resize-none ${error ? 'border-red-500' : ''} ${className}`} rows={4} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <select className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#1769E0] focus:ring-2 focus:ring-[#1769E0]/20 outline-none transition-all text-sm bg-white ${className}`} {...props}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
