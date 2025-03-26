
import React, { useState } from 'react';
import IntroAnimation from './IntroAnimation';
import BeruDialog, { UserData } from './BeruDialog';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [introComplete, setIntroComplete] = useState(false);
  
  const handleIntroComplete = () => {
    setIntroComplete(true);
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-solo-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!introComplete ? (
        <IntroAnimation onComplete={handleIntroComplete} />
      ) : (
        <BeruDialog onComplete={onComplete} />
      )}
    </motion.div>
  );
};

export default Onboarding;
