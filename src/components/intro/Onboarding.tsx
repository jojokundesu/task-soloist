
import React, { useState } from 'react';
import IntroAnimation from './IntroAnimation';
import BeruDialog, { UserData } from './BeruDialog';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [introComplete, setIntroComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const handleIntroComplete = () => {
    console.log("Handling intro animation completion");
    setIntroComplete(true);
  };
  
  const handleBeruComplete = (userData: UserData) => {
    console.log("Handling BeruDialog completion with user data:", userData);
    // First mark as not visible to start fading out
    setIsVisible(false);
    
    // Wait for animation to complete before calling parent's onComplete
    setTimeout(() => {
      onComplete(userData);
    }, 500); // Match the exit animation duration
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-solo-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {!introComplete ? (
        <IntroAnimation onComplete={handleIntroComplete} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          <BeruDialog onComplete={handleBeruComplete} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Onboarding;
