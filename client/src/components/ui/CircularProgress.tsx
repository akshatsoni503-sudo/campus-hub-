import React, { useEffect, useState } from 'react';

interface CircularProgressProps { percentage: number; size?: number; strokeWidth?: number; color?: string; }

export default function CircularProgress({ percentage, size = 100, strokeWidth = 8, color = '#1769E0' }: CircularProgressProps) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPct / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-[#17105F]">{Math.round(animatedPct)}%</span>
        <span className="block text-[10px] text-gray-500 font-medium">Match</span>
      </div>
    </div>
  );
}

interface ProgressBarProps { label: string; percentage: number; detail?: string; }

export function ProgressBar({ label, percentage, detail }: ProgressBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}{detail && <span className="text-gray-400 ml-1">({detail})</span>}</span>
        <span className="font-semibold text-[#17105F]">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#1769E0] to-[#10B981] rounded-full animate-progress transition-all duration-1000" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
