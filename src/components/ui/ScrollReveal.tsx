'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'header';
  direction?: 'up' | 'down' | 'pop' | 'auto' | 'none';
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  intensity?: 'subtle' | 'medium' | 'high';
}

export default function ScrollReveal({
  children,
  className = '',
  as = 'div',
  direction = 'pop',
  delay = 0,
  duration = 750,
  threshold = 0.1,
  rootMargin = '-20px 0px -40px 0px',
  once = false,
  intensity = 'high'
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [entryFrom, setEntryFrom] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if element entered from top or bottom of viewport
            if (entry.boundingClientRect.top < 80) {
              setEntryFrom('top');
            } else {
              setEntryFrom('bottom');
            }
            setIsVisible(true);

            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            // When scrolling away in either direction, reset visibility so it pops up again
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Configure pop distances and scale based on intensity
  const scaleValue = intensity === 'high' ? 0.88 : intensity === 'medium' ? 0.93 : 0.96;
  const translateYValue = intensity === 'high' ? 56 : intensity === 'medium' ? 38 : 24;

  const getTransform = () => {
    if (isVisible) return 'translateY(0) scale(1)';

    if (direction === 'auto') {
      return entryFrom === 'top'
        ? `translateY(-${translateYValue}px) scale(${scaleValue})`
        : `translateY(${translateYValue}px) scale(${scaleValue})`;
    }

    if (direction === 'pop') {
      return `translateY(${translateYValue}px) scale(${scaleValue})`;
    }

    if (direction === 'up') {
      return `translateY(${translateYValue + 12}px) scale(${scaleValue})`;
    }

    if (direction === 'down') {
      return `translateY(-${translateYValue + 12}px) scale(${scaleValue})`;
    }

    return `scale(${scaleValue})`;
  };

  const Component = as as keyof JSX.IntrinsicElements;

  // Spring overshoot cubic bezier for an unmistakable, energetic pop-up bounce
  const springEasing = 'cubic-bezier(0.18, 1.25, 0.32, 1)';

  return (
    <Component
      ref={elementRef as any}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: isVisible
          ? `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms ${springEasing} ${delay}ms`
          : 'opacity 200ms ease-out, transform 200ms ease-out',
        willChange: 'opacity, transform',
        transformOrigin: 'center center'
      }}
    >
      {children}
    </Component>
  );
}
