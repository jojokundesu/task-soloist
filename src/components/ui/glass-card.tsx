
import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  hover = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl p-4 bg-opacity-10 bg-black backdrop-blur-md border border-white/10 shadow-lg',
        hover && 'transition-all duration-300 hover:bg-opacity-20 hover:border-solo-accent/30 hover:shadow-solo-accent/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
