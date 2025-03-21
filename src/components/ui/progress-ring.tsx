
import { cn } from '@/lib/utils';
import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  background?: string;
  foreground?: string;
  children?: React.ReactNode;
  animate?: boolean;
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  background = "rgb(26, 31, 44)",
  foreground = "rgb(139, 92, 246)",
  children,
  animate = true,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={animate ? "transform transition-transform duration-1000" : ""}
      >
        <circle
          className="transition-all duration-500 ease-in-out"
          stroke={background}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-in-out"
          stroke={foreground}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
            animation: animate ? "progress-ring 1.5s ease-out" : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;
