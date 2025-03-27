
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
    console.log("Intro animation complete, showing dialog");
    setIntroComplete(true);
  };
  
  const handleBeruComplete = (userData: UserData) => {
    console.log("Beru dialog complete, data:", userData);
    onComplete(userData);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-solo-bg">
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
    </div>
  );
};

export default Onboarding;
