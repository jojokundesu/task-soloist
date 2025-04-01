
import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import ChatInterface from '@/components/chat/ChatInterface';
import ShatterAnimation from '@/components/animations/ShatterAnimation';

const Chat = () => {
  const [showShatterAnimation, setShowShatterAnimation] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const handleTriggerAnimation = () => {
    setShowShatterAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowShatterAnimation(false);
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Consult with Beru
          </h1>
          <p className="text-solo-secondary mt-2">Your loyal servant awaits your commands</p>
          
          <button 
            onClick={handleTriggerAnimation}
            className="mt-4 px-4 py-2 bg-solo-accent hover:bg-solo-accent/80 rounded text-white text-sm"
          >
            Trigger Shatter Animation
          </button>
        </div>
        
        {showChat && <ChatInterface />}
      </div>
      
      <ShatterAnimation 
        isActive={showShatterAnimation} 
        onAnimationComplete={handleAnimationComplete} 
      />
      
      <NavBar />
    </div>
  );
};

export default Chat;
