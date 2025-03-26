
import React, { useState, useEffect } from 'react';
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
        y: [0, window.innerHeight * 1.5],
        rotate: [0, Math.random() * 720 - 360],
        opacity: [1, 0.8, 0],
      } : {}}
      transition={falling ? {
        duration: 2.5,
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
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  
  // Generate enough shards to cover the screen
  const shardCount = 49; // 7x7 grid of shards for more visual impact
  
  // Handle device orientation changes
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setDeviceOrientation({
          beta: event.beta, // Front-to-back tilt
          gamma: event.gamma // Left-to-right tilt
        });
      }
    };
    
    // Add event listener for device orientation
    window.addEventListener('deviceorientation', handleOrientation);
    
    // Start the animation immediately instead of using a delay
    console.log("Starting shard animation");
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
  
  const handleShardsComplete = () => {
    console.log("Shards animation complete");
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
            <Shard 
              key={i} 
              index={i} 
              total={shardCount} 
              onComplete={handleShardsComplete} 
            />
          ))}
          
          {/* Few shards that remain in the corner */}
          <motion.div 
            className="absolute right-0 top-0 w-20 h-20 bg-black opacity-80" 
            style={{ 
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              transform: `rotate(${deviceOrientation.gamma * 0.2}deg)` 
            }}
          />
          <motion.div 
            className="absolute left-0 bottom-0 w-16 h-16 bg-black opacity-60" 
            style={{ 
              clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
              transform: `rotate(${deviceOrientation.beta * 0.2}deg)` 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
