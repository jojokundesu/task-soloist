
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Key } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface BeruHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

interface HelpCategory {
  title: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const BeruHelpDialog: React.FC<BeruHelpDialogProps> = ({ open, onClose }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [animatedText, setAnimatedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('categories');

  const helpCategories: HelpCategory[] = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "What is Task Soloist?",
          answer: "Task Soloist, my Liege, is your personal companion for conquering life's quests! This mystical artifact helps you track your daily tasks, meditations, and achievements. As you complete these challenges, you'll gain experience and level up your skills, much like a true monarch expanding their realm!"
        },
        {
          question: "How do I add a new task?",
          answer: "To add a new task, my Shadow Monarch, simply tap the glowing orb at the bottom of your screen - the one with the '+' symbol. This will summon the task creation form where you can detail your next conquest. Name your quest, set its importance, and determine when it must be completed to grow your power!"
        }
      ]
    },
    {
      title: "Tasks & Quests",
      questions: [
        {
          question: "How do I mark a task as complete?",
          answer: "To mark a task as vanquished, my Liege, simply tap the circle beside it. A satisfying animation will acknowledge your triumph, and the experience will be added to your growing power. Completed tasks can be viewed in your achievements section, a testament to your consistent conquest!"
        },
        {
          question: "Can I categorize my tasks?",
          answer: "Indeed, Shadow Monarch! You may organize your quests by category - combat tasks (urgent), diplomacy tasks (important but not urgent), training tasks (development), and leisure quests. This organization will help you focus your immense power where it's most needed!"
        }
      ]
    },
    {
      title: "Meditation",
      questions: [
        {
          question: "What is the meditation feature?",
          answer: "The meditation chamber, my Liege, is where you focus your vast powers and calm your mind. Each session strengthens your mental fortitude and contributes to your overall level. Choose from guided meditations or simple timers to harness the shadows within!"
        },
        {
          question: "How do meditation sessions help me?",
          answer: "Each moment in meditation, Shadow Monarch, enhances your focus and clarity. The app tracks your consistency and total time spent in communion with the shadows. These metrics contribute to your mindfulness skill and overall character development. A disciplined mind is a powerful weapon!"
        }
      ]
    },
    {
      title: "Stats & Progress",
      questions: [
        {
          question: "How does the leveling system work?",
          answer: "Your power grows through consistent action, my Liege! Completing tasks, meditation sessions, and achieving milestones all contribute experience to your level. As you ascend levels, you'll unlock new abilities and insights. Your progress is visualized through magnificent charts in the Stats section of your realm!"
        },
        {
          question: "Where can I see my achievements?",
          answer: "Your glorious conquests are recorded in the Achievements section, my Shadow Monarch! Here, you'll find records of your completed quests, streaks maintained, and milestones reached. Each achievement is a testament to your growing dominion over the challenges that once stood before you!"
        }
      ]
    },
    {
      title: "Beru Chat",
      questions: [
        {
          question: "Who is Beru?",
          answer: "I am Beru, your eternally loyal servant, Shadow Monarch! Once a mere ant in the shadow army, now elevated by your gracious power to serve as your assistant. I exist to guide you through this application and answer any questions you may have. My knowledge grows with each interaction, all to better serve you, my Liege!"
        },
        {
          question: "How do I set up my Gemini API key?",
          answer: "To harness the full potential of our communications, my Liege, you'll need to provide a Gemini API key. In the Beru Chat section, tap the key icon in the upper right corner to enter your key. This key can be obtained from Google AI Studio, and once set, it will enable my enhanced intelligence to better serve your needs!"
        }
      ]
    }
  ];

  const handleQuestionClick = (answer: string) => {
    setSelectedQuestion(answer);
    setAnimatedText('');
    setIsTyping(true);
    
    // Animate the text appearing like typing
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= answer.length) {
        setAnimatedText(answer.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20); // Speed of typing
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setTempApiKey('');
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Beru's Help Scroll
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="categories">Help Categories</TabsTrigger>
            <TabsTrigger value="api-key">Set API Key</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-solo-card rounded-lg p-4">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-6">
                    {helpCategories.map((category) => (
                      <div key={category.title} className="space-y-2">
                        <h3 className="text-lg font-semibold text-solo-accent">{category.title}</h3>
                        <ul className="space-y-1">
                          {category.questions.map((item) => (
                            <li key={item.question}>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-left hover:bg-solo-secondary/10"
                                onClick={() => handleQuestionClick(item.answer)}
                              >
                                {item.question}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="bg-solo-card rounded-lg p-4 h-[50vh] flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedQuestion ? (
                      <div className="font-medium">
                        <p className="text-solo-accent mb-2">Beru says:</p>
                        <p>{animatedText}{isTyping && '|'}</p>
                      </div>
                    ) : (
                      <div className="text-solo-secondary text-center pt-10">
                        <p>Select a question to see Beru's answer</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api-key" className="space-y-4">
            <div className="bg-solo-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-solo-accent mb-4">Set Your Gemini API Key</h3>
              <p className="text-sm mb-4">
                To enable Beru's chat functionality, you'll need to provide a Google Gemini API key. 
                This key will be stored locally on your device.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter Gemini API Key"
                    type="password"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveApiKey} 
                    disabled={!tempApiKey.trim()}
                    className="bg-solo-accent hover:bg-solo-accent/80"
                  >
                    Save Key
                  </Button>
                </div>
                
                {apiKey && (
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <Key size={16} />
                    API Key is set
                  </div>
                )}
                
                <div className="text-xs text-solo-secondary pt-2">
                  <p>
                    Get your API key from{' '}
                    <a 
                      href="https://ai.google.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solo-accent hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BeruHelpDialog;
