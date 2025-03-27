
import React from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp);
  
  return (
    <div 
      className={cn(
        "flex", 
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser 
            ? "bg-solo-accent text-white rounded-tr-none" 
            : "bg-solo-secondary/10 text-foreground rounded-tl-none",
          message.isError && "bg-red-400/20 text-red-500 border border-red-300"
        )}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs opacity-50 mt-1 text-right">
          {format(timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
