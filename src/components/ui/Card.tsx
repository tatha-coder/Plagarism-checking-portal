import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({ children, className = '', hoverEffect = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-subtle ${
        hoverEffect ? 'transition-all duration-200 hover:shadow-card-hover hover:border-slate-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 sm:p-6 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 sm:px-6 bg-slate-50/50 border-t border-slate-100 rounded-b-xl ${className}`}>{children}</div>;
}
