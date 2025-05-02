
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeruHelpIconProps {
  onClick: () => void;
  className?: string;
}

const BeruHelpIcon: React.FC<BeruHelpIconProps> = ({ onClick, className }) => {
  return (
    <div 
      className={cn(
        "fixed bottom-24 right-4 h-12 w-12 md:h-14 md:w-14 rounded-full bg-solo-accent flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform z-50",
        className
      )}
      onClick={onClick}
      title="Ask Beru for help"
    >
      <div className="relative">
        <MessageCircle className="text-white w-6 h-6 md:w-7 md:h-7" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default BeruHelpIcon;
