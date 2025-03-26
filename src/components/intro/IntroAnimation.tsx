
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShardProps {
  index: number;
  total: number;
  onComplete: () => void;
}

const Shard = ({ index, total, onComplete }: ShardProps) => {
  const [falling, setFalling] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFalling(true);
      
      // Last shard triggers the onComplete callback
      if (index === total - 1) {
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 100 + index * 50); // Stagger the falling of shards
    
    return () => clearTimeout(timeout);
  }, [index, total, onComplete]);
  
  // Calculate positions for shards to create a screen-covering effect
  const size = 100 / Math.sqrt(total);
  const row = Math.floor(index / Math.sqrt(total));
  const col = index % Math.sqrt(total);
  
  const top = row * size;
  const left = col * size;
  
  return (
    <motion.div
      className="absolute bg-black"
      style={{
        width: `${size}vw`,
        height: `${size}vh`,
        top: `${top}vh`,
        left: `${left}vw`,
        zIndex: 50,
      }}
      initial={{ opacity: 1 }}
      animate={falling ? {
        y: [0, window.innerHeight],
        rotate: [0, Math.random() * 720 - 360],
        opacity: [1, 0.8, 0],
      } : {}}
      transition={falling ? {
        duration: 1.5,
        ease: [0.645, 0.045, 0.355, 1.000],
      } : {}}
    />
  );
};

interface IntroAnimationProps {
  onComplete: () => void;
  className?: string;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, className }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Generate enough shards to cover the screen
  const shardCount = 36; // 6x6 grid of shards
  
  const handleShardsComplete = () => {
    setAnimationComplete(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };
  
  return (
    <AnimatePresence>
      {!animationComplete && (
        <motion.div
          className={cn("fixed inset-0 bg-black overflow-hidden", className)}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 40 }}
        >
          {Array.from({ length: shardCount }).map((_, i) => (
            <Shard key={i} index={i} total={shardCount} onComplete={handleShardsComplete} />
          ))}
          
          {/* Few shards that remain in the corner */}
          <motion.div 
            className="absolute right-0 top-0 w-20 h-20 bg-black opacity-80" 
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
          />
          <motion.div 
            className="absolute left-0 bottom-0 w-16 h-16 bg-black opacity-60" 
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
