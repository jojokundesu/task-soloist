
import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Consult with Beru
          </h1>
          <p className="text-solo-secondary mt-2">Your loyal servant awaits your commands</p>
        </div>
        
        <ChatInterface />
      </div>
      
      <NavBar />
    </div>
  );
};

export default Chat;
