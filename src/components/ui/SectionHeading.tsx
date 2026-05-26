import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon?: LucideIcon;
  children: string;
  className?: string;
}

export function SectionHeading({ icon: Icon, children, className = '' }: SectionHeadingProps) {
  return (
    <h2 className={`text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="w-5 h-5 text-neon-cyan" />}
      {children}
    </h2>
  );
}
