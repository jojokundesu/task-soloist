
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ShatterAnimation from '../animations/ShatterAnimation';

interface IntroAnimationProps {
  onComplete: () => void;
  className?: string;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, className }) => {
  const [showShatter, setShowShatter] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  
  const handleShatterComplete = () => {
    console.log("Shatter animation complete");
    setShowShatter(false);
    setShowTitle(true);
  };
  
  useEffect(() => {
    if (showTitle) {
      console.log("Starting title animation");
      // Use a more reliable way to handle animation completion
      const timer = setTimeout(() => {
        console.log("Title animation complete, calling onComplete callback");
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showTitle, onComplete]);
  
  return (
    <motion.div 
      className={cn("fixed inset-0 bg-black z-50", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ShatterAnimation 
        isActive={showShatter} 
        onAnimationComplete={handleShatterComplete}
      />
      
      {showTitle && (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.h1 
            className="text-solo-accent text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Task Soloist
          </motion.h1>
        </div>
      )}
    </motion.div>
  );
};

export default IntroAnimation;
