
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShardProps {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  xVelocity: number;
  yVelocity: number;
  rotation: number;
  rotationVelocity: number;
  color?: string;
}

const Shard: React.FC<ShardProps> = ({
  x, y, width, height, delay, xVelocity, yVelocity, rotation, rotationVelocity, color = '#000'
}) => {
  return (
    <motion.div
      className="absolute"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        top: y,
        left: x,
        transformOrigin: 'center',
      }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        x: xVelocity,
        y: yVelocity,
        rotate: rotation + rotationVelocity,
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: [0.2, 0.6, 0.4, 1],
      }}
    />
  );
};

interface ShatterAnimationProps {
  isActive: boolean;
  onAnimationComplete?: () => void;
  color?: string;
  columns?: number;
  rows?: number;
}

const ShatterAnimation: React.FC<ShatterAnimationProps> = ({
  isActive,
  onAnimationComplete,
  color = '#000',
  columns = 10,
  rows = 15,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shards, setShards] = useState<ShardProps[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasShattered, setHasShattered] = useState(false);

  // Setup dimensions and create shards when active
  useEffect(() => {
    if (isActive && containerRef.current && !hasShattered) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      
      const shardWidth = width / columns;
      const shardHeight = height / rows;
      const newShards: ShardProps[] = [];

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * shardWidth;
          const y = j * shardHeight;
          
          // Determine if shard hangs (more likely if near the top)
          const hangs = y < height * 0.15 && Math.random() < 0.7;
          const delay = hangs ? Math.random() * 0.4 + 0.1 : Math.random() * 0.2;
          
          newShards.push({
            x,
            y,
            width: shardWidth * (0.95 + Math.random() * 0.1), // Slight variation in size
            height: shardHeight * (0.95 + Math.random() * 0.1),
            delay,
            xVelocity: (Math.random() - 0.5) * width * 0.8, // Random horizontal direction
            yVelocity: hangs ? Math.random() * height * 0.3 : height * (0.5 + Math.random() * 0.5), // Fall down
            rotation: Math.random() * 20 - 10,
            rotationVelocity: (Math.random() - 0.5) * 270,
            color,
          });
        }
      }
      
      setShards(newShards);
      setHasShattered(true);
      
      // Trigger animation complete callback after all shards have fallen
      const maxDelay = Math.max(...newShards.map(shard => shard.delay));
      const timeoutId = setTimeout(() => {
        onAnimationComplete?.();
      }, (maxDelay + 2) * 1000); // 2 seconds is the animation duration
      
      return () => clearTimeout(timeoutId);
    }
  }, [isActive, columns, rows, color, onAnimationComplete, hasShattered]);

  // Reset when inactive
  useEffect(() => {
    if (!isActive) {
      setHasShattered(false);
      setShards([]);
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-hidden pointer-events-none ${isActive ? 'block' : 'hidden'}`}
    >
      <AnimatePresence>
        {isActive && (
          <>
            {/* Initial black screen that will shatter */}
            {!hasShattered && (
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: hasShattered ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Shards */}
            {shards.map((shard, index) => (
              <Shard key={index} {...shard} />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShatterAnimation;
