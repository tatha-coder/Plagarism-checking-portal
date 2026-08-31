import React from 'react';
import { getRiskColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'academic' | 'low' | 'moderate' | 'high' | 'very_high' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  let variantStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'academic') {
    variantStyles = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-slate-600 border-slate-300';
  } else if (['low', 'moderate', 'high', 'very_high'].includes(variant)) {
    const risk = getRiskColor(variant as 'low' | 'moderate' | 'high' | 'very_high');
    variantStyles = risk.badge;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
