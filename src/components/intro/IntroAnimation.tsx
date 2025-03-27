
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IntroAnimationProps {
  onComplete: () => void;
  className?: string;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, className }) => {
  useEffect(() => {
    // Simply wait a short time then complete
    console.log("Starting intro animation");
    const timer = setTimeout(() => {
      console.log("Intro animation complete");
      onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div 
      className={cn("fixed inset-0 bg-black overflow-hidden z-50", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h1 className="text-solo-accent text-5xl font-bold">Task Soloist</h1>
      </motion.div>
    </motion.div>
  );
};

export default IntroAnimation;
