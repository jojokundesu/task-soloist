
import React from 'react';
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
        {/* Beru Face Icon */}
        <div className="w-8 h-8 md:w-10 md:h-10 bg-contain bg-center bg-no-repeat" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='white'%3E%3Cpath d='M32,8C18.7,8,8,18.7,8,32s10.7,24,24,24s24-10.7,24-24S45.3,8,32,8z M32,52c-11,0-20-9-20-20s9-20,20-20s20,9,20,20 S43,52,32,52z'/%3E%3Cpath d='M24,30c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S22.3,30,24,30z'/%3E%3Cpath d='M40,30c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S38.3,30,40,30z'/%3E%3Cpath d='M44,38c0-0.6-0.4-1-1-1H21c-0.6,0-1,0.4-1,1s0.4,1,1,1h22C43.6,39,44,38.6,44,38z'/%3E%3C/svg%3E")` 
             }}
        ></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default BeruHelpIcon;
