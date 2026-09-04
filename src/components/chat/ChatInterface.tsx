import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import { useApp } from '@/context/AppContext';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { getChat, sendChat, clearChat } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Greetings, my Liege! I am Beru, your loyal servant. I run entirely offline within this System. How may I assist you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChat()
      .then((msgs) => {
        if (msgs?.length) setMessages(msgs as Message[]);
      })
      .catch(() => {
        /* keep default welcome */
      });
  }, [getChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    setInput('');
    setIsLoading(true);

    const optimistic: Message = {
      id: `local-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const newMsgs = await sendChat(content);
      setMessages((prev) => {
        // replace optimistic user msg + append assistant from server pair
        const withoutOptimistic = prev.filter((m) => m.id !== optimistic.id);
        return [...withoutOptimistic, ...(newMsgs as Message[])];
      });
    } catch {
      const fallback: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Forgive me, my Liege — the local System chamber is momentarily unreachable. Ensure the Task Soloist server is running, then try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChat();
    } catch {
      /* ignore */
    }
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          'Greetings, my Liege! I am Beru, your loyal servant. How may I assist you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className={`flex flex-col h-[80vh] bg-solo-bg rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between border-b border-solo-secondary/20 p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Beru Chat</h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 uppercase tracking-wide">
            Offline AI
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearChat} title="Clear Chat">
          <Trash2 size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center my-2">
            <Spinner size="sm" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-solo-secondary/20 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Beru anything..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-solo-accent hover:bg-solo-accent/80"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[10px] text-solo-secondary mt-2 text-center">
          Powered by local Beru engine · no internet required
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
