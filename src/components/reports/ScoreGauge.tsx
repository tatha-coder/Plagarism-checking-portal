import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
}

export function ScoreGauge({
  score,
  size = 140,
  strokeWidth = 12,
  riskLevel,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    low: { stroke: '#10B981', text: 'text-emerald-600', label: 'Low Similarity' },
    moderate: { stroke: '#F59E0B', text: 'text-amber-600', label: 'Moderate Similarity' },
    high: { stroke: '#F97316', text: 'text-orange-600', label: 'High Similarity' },
    very_high: { stroke: '#EF4444', text: 'text-rose-600', label: 'Critical Similarity' },
  };

  const current = colorMap[riskLevel] || colorMap.low;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={current.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-extrabold tracking-tight ${current.text}`}>
          {score.toFixed(1)}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
          Similarity
        </span>
      </div>
    </div>
  );
}
