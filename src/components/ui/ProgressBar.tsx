import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  colorOverride?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className = '',
  size = 'md',
  colorOverride,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let barColor = colorOverride;
  if (!barColor) {
    if (percentage <= 15) barColor = 'bg-emerald-500';
    else if (percentage <= 30) barColor = 'bg-amber-500';
    else if (percentage <= 50) barColor = 'bg-orange-500';
    else barColor = 'bg-rose-500';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
          <span>Similarity</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
