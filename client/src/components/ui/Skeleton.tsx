import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${width}`} />;
}

export function SkeletonAvatar({ size = 'w-10 h-10' }: { size?: string }) {
  return <div className={`${size} rounded-full bg-gray-200 animate-pulse`} />;
}
