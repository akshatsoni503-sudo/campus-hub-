import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; }

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[85vh] overflow-y-auto animate-fadeIn`}>
        {title && (
          <div className="flex items-center justify-between p-6 pb-4 border-b">
            <h2 className="text-lg font-bold text-[#17105F]">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
