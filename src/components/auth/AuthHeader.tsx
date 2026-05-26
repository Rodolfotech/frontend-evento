import { Sparkles } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
