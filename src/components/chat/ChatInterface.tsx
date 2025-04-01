
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import { toast } from '@/components/ui/use-toast';

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
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [isSettingApiKey, setIsSettingApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

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
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please set your Google Gemini API key to continue.",
          variant: "destructive",
        });
        setIsSettingApiKey(true);
        setIsLoading(false);
        return;
      }
      
      const response = await fetchGeminiResponse(input, messages, apiKey);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Check if error is related to API key
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.toString().includes('API') 
          ? 'Forgive me, my Liege! It seems my connection to the shadows requires a valid API key. Please set your Google Gemini API key to continue.'
          : 'Forgive me, my Liege! I encountered an issue while trying to respond. Perhaps my connection to the shadows has been temporarily disrupted.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      if (error.toString().includes('API')) {
        setIsSettingApiKey(true);
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeminiResponse = async (userInput: string, messageHistory: Message[], apiKey: string): Promise<string> => {
    // Format the conversation history for Gemini
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add the system message to guide Gemini's responses
    const systemMessage = {
      role: "user",
      parts: [{ 
        text: `You are Beru, a loyal servant to the Shadow Monarch (the user). 
        Speak in a respectful, medieval fantasy style, addressing the user as "my Liege" or "Shadow Monarch".
        You are knowledgeable about the Task Soloist app and can guide the user on using its features.
        The app helps users track daily tasks, meditation, skills, and achievements to level up in life.
        Always maintain your character as a devoted servant eager to please your master.
        
        This is a system message to establish your character. Respond to the next user message in character.`
      }]
    };
    
    // Add the current user input
    const finalUserMessage = {
      role: "user",
      parts: [{ text: userInput }]
    };
    
    try {
      // Use proper format for the Gemini API
      // Note: The API expects a different format than what we had before
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [systemMessage, ...formattedMessages.slice(-5), finalUserMessage], // Include last 5 messages for context
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated from Gemini API");
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error in Gemini API call:', error);
      throw error;
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setIsSettingApiKey(false);
      setTempApiKey('');
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully."
      });
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Greetings, my Liege! I am Beru, your loyal servant. How may I assist you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className={`flex flex-col h-[80vh] bg-solo-bg rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between border-b border-solo-secondary/20 p-3">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Beru Chat</h2>
          {apiKey && (
            <div className="ml-2 text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">
              API Connected
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSettingApiKey(true)}
            title="Set API Key"
          >
            <Key size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </Button>
        </div>
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
      
      {isSettingApiKey ? (
        <div className="border-t border-solo-secondary/20 p-4">
          <div className="space-y-2">
            <p className="text-sm text-solo-secondary">Enter your Google Gemini API key:</p>
            <div className="flex gap-2">
              <Input
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="API Key"
                className="flex-1"
                type="password"
              />
              <Button 
                onClick={handleSaveApiKey} 
                disabled={!tempApiKey.trim()}
                className="bg-solo-accent hover:bg-solo-accent/80"
              >
                Save
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsSettingApiKey(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-solo-secondary">
              Get your API key from 
              <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-solo-accent hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ChatInterface;
