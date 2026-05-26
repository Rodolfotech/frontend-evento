import type { ReactNode } from 'react';

type Glow = 'cyan' | 'purple' | 'pink';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: Glow;
  padding?: 'sm' | 'md' | 'lg';
}

const glowClasses: Record<Glow, string> = {
  cyan: 'glow-cyan',
  purple: 'glow-purple',
  pink: 'glow-pink',
};

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({ children, className = '', glow, padding = 'lg' }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl ${paddingClasses[padding]} ${glow ? glowClasses[glow] : ''} ${className}`}
    >
      {children}
    </div>
  );
}
