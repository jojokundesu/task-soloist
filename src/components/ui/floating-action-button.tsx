
import React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'ghost';
}

const FloatingActionButton = ({
  onClick,
  className,
  icon = <Plus className="h-6 w-6" />,
  variant = 'default',
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-6 z-50 rounded-full p-4 w-14 h-14 shadow-lg animate-pulse-glow flex items-center justify-center',
        className
      )}
      variant={variant}
    >
      {icon}
    </Button>
  );
};

export default FloatingActionButton;
