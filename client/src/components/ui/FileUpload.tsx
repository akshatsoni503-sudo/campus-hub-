import React, { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadProps { onFileSelect: (file: File) => void; accept?: string; maxSize?: number; label?: string; }

export default function FileUpload({ onFileSelect, accept = '.jpg,.jpeg,.png,.pdf', maxSize = 5, label }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback((f: File) => {
    setError('');
    if (f.size > maxSize * 1024 * 1024) { setError(`File size must be less than ${maxSize}MB`); return; }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowed.includes(f.type)) { setError('Only JPG, PNG, or PDF files allowed'); return; }
    setFile(f);
    onFileSelect(f);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>}
      {!file ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-[#1769E0] bg-blue-50' : 'border-gray-300 hover:border-[#1769E0]'}`}
        >
          <input type="file" accept={accept} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-sm"><span className="text-[#1769E0] font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF (MAX. {maxSize}MB)</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <FileText className="w-8 h-8 text-green-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => { setFile(null); }} className="p-1 hover:bg-green-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
