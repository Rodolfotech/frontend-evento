import type { LucideIcon } from 'lucide-react';

interface GradientButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  children: string;
  gradient?: 'cyan-purple' | 'purple-pink' | 'pink-purple';
  className?: string;
  fullWidth?: boolean;
}

const gradientClasses = {
  'cyan-purple': 'from-neon-cyan to-neon-purple',
  'purple-pink': 'from-neon-purple to-neon-pink',
  'pink-purple': 'from-pink-500 to-purple-600',
};

export function GradientButton({
  onClick,
  type = 'button',
  disabled,
  loading,
  loadingText,
  icon: Icon,
  children,
  gradient = 'cyan-purple',
  className = '',
  fullWidth = true,
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${gradientClasses[gradient]} text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {loading ? (loadingText || 'Procesando...') : children}
    </button>
  );
}
