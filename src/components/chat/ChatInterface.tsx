
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Greetings, my Liege! I am Beru, your loyal servant. How may I assist you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKeyRef = useRef<string | null>(localStorage.getItem('gemini_api_key'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Check if API key exists
      if (!apiKeyRef.current) {
        const apiKey = prompt('Please enter your Google Gemini API key:');
        if (apiKey) {
          localStorage.setItem('gemini_api_key', apiKey);
          apiKeyRef.current = apiKey;
        } else {
          throw new Error('API key is required');
        }
      }
      
      const response = await fetchGeminiResponse(input, messages, apiKeyRef.current);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Forgive me, my Liege! I encountered an issue while trying to respond. Perhaps my connection to the shadows has been temporarily disrupted.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeminiResponse = async (userInput: string, messageHistory: Message[], apiKey: string): Promise<string> => {
    // Format the conversation history for Gemini
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // Add the system message to guide Gemini's responses
    const systemMessage = {
      role: "system",
      parts: [{ 
        text: `You are Beru, a loyal servant to the Shadow Monarch (the user). 
        Speak in a respectful, medieval fantasy style, addressing the user as "my Liege" or "Shadow Monarch".
        You are knowledgeable about the Task Soloist app and can guide the user on using its features.
        The app helps users track daily tasks, meditation, skills, and achievements to level up in life.
        Always maintain your character as a devoted servant eager to please your master.`
      }]
    };
    
    // Add the current user input
    formattedMessages.push({
      role: "user",
      parts: [{ text: userInput }]
    });
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [systemMessage, ...formattedMessages],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error in Gemini API call:', error);
      throw error;
    }
  };

  return (
    <div className={`flex flex-col h-[80vh] bg-solo-bg rounded-lg shadow-lg ${className}`}>
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
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
      </div>
    </div>
  );
};

export default ChatInterface;
