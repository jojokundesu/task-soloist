
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HelpItem {
  id: string;
  question: string;
  answer: string;
}

interface HelpCategory {
  id: string;
  title: string;
  items: HelpItem[];
}

const helpData: HelpCategory[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      {
        id: 'general-1',
        question: 'What is Task Soloist?',
        answer: 'Task Soloist is a personal development application designed to help you track daily tasks, meditation sessions, skills, and achievements. By completing tasks and activities, you level up in real life while receiving guidance from me, Beru, your loyal servant.'
      },
      {
        id: 'general-2',
        question: 'How do I navigate the app?',
        answer: 'My Liege, the navigation bar at the bottom of the screen allows you to access different sections: Home, Tasks, Achievements, Calendar, Meditation, Chat, and Profile. Simply tap on the icon of your choice, and I shall guide you there immediately!'
      },
      {
        id: 'general-3',
        question: 'What is the Shadow Monarch?',
        answer: 'The Shadow Monarch, which is YOU, my Liege, is the supreme ruler of all shadows. In this app, you are on a journey to reclaim your true power by conquering daily challenges, developing skills, and achieving greatness in the mortal realm!'
      }
    ]
  },
  {
    id: 'tasks',
    title: 'Tasks',
    items: [
      {
        id: 'tasks-1',
        question: 'How do I add a new task?',
        answer: 'To add a new task, my Liege, navigate to the Tasks section by tapping the checklist icon in the navigation bar. Then, tap the "+" button. Fill in the task details, select its category and priority, and tap "Save". Your command shall be registered immediately!'
      },
      {
        id: 'tasks-2',
        question: 'How do I mark a task as complete?',
        answer: 'Simply tap on the checkbox next to any task to mark it as complete, my Liege! The shadows will rejoice at your accomplishment, and your progress shall be recorded. Completed tasks contribute to your overall growth and power!'
      },
      {
        id: 'tasks-3',
        question: 'Can I edit or delete a task?',
        answer: 'Of course, my Liege! To edit a task, tap on it to open its details, then tap the edit icon. To delete a task, swipe left on the task and tap the delete icon, or tap and hold to reveal more options. Your will is my command!'
      }
    ]
  },
  {
    id: 'meditation',
    title: 'Meditation',
    items: [
      {
        id: 'meditation-1',
        question: 'How do I start a meditation session?',
        answer: 'To commune with the shadows through meditation, my Liege, navigate to the Meditation section using the navigation bar. Choose your preferred duration and meditation type, then tap "Begin Meditation". Close your eyes and let the shadows embrace you!'
      },
      {
        id: 'meditation-2',
        question: 'What types of meditation are available?',
        answer: 'The app offers various shadow meditation techniques, my Liege: Mindfulness for focus, Loving-Kindness for compassion, Transcendental for peace, and Shadow Connection for deepening your bond with the dark forces at your command!'
      },
      {
        id: 'meditation-3',
        question: 'How does meditation help me?',
        answer: 'Regular meditation strengthens your vessel, my Liege! It enhances focus, reduces stress, increases self-awareness, and deepens your connection to the shadows. A calm mind is a powerful mind, and your power shall grow with each session!'
      }
    ]
  },
  {
    id: 'achievements',
    title: 'Achievements & Skills',
    items: [
      {
        id: 'achievements-1',
        question: 'How do I earn achievements?',
        answer: 'Achievements are unlocked through consistent actions, my Liege! Complete daily tasks, maintain streaks, reach meditation milestones, and develop skills to earn badges of honor. Each achievement is a testament to your growing power!'
      },
      {
        id: 'achievements-2',
        question: 'How do I level up my skills?',
        answer: 'Skills grow through practice and dedication, my Liege. Track your progress in the Skills section, complete related tasks, and allocate time to deliberate practice. As you invest time, your skills will level up, unlocking new abilities!'
      },
      {
        id: 'achievements-3',
        question: 'What is the benefit of tracking skills?',
        answer: 'Tracking skills provides clarity on your growth journey, my Liege. It helps identify strengths to leverage and weaknesses to improve. The shadows celebrate each skill you master, for it brings you closer to realizing your full potential!'
      }
    ]
  },
  {
    id: 'chat',
    title: 'Chat with Beru',
    items: [
      {
        id: 'chat-1',
        question: 'How do I chat with you, Beru?',
        answer: 'To summon me for a conversation, my Liege, tap the Chat icon in the navigation bar. Type your message in the input field and send it. I shall respond with haste, ever eager to assist you in your journey to greatness!'
      },
      {
        id: 'chat-2',
        question: 'What can I ask you about?',
        answer: 'You may inquire about anything, my Liege! Ask for guidance on using the app, request motivation, seek knowledge, or simply engage in conversation. I possess information about the mortal realm and beyond, and exist solely to serve you!'
      },
      {
        id: 'chat-3',
        question: 'Do I need an API key to chat with you?',
        answer: 'Yes, my Liege. To establish our telepathic connection, you must provide a Gemini API key from Google AI Studio. This key allows me to draw upon vast knowledge to serve you better. Fear not, for it is free to obtain!'
      }
    ]
  }
];

interface BeruHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const BeruHelpDialog: React.FC<BeruHelpDialogProps> = ({ open, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setIsTyping(true);
      setDisplayText('');
      
      let currentText = '';
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < selectedItem.answer.length) {
          currentText += selectedItem.answer.charAt(index);
          setDisplayText(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15); // Faster typing speed for better UX
      
      return () => clearInterval(typingInterval);
    }
  }, [selectedItem]);

  const handleSelectQuestion = (item: HelpItem) => {
    setSelectedItem(item);
  };

  const handleBackToQuestions = () => {
    setSelectedItem(null);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto bg-solo-bg border-solo-accent/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span className="bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Beru's Knowledge Repository
            </span>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-solo-accent/10"
            >
              <X size={18} />
            </button>
          </DialogTitle>
        </DialogHeader>

        {!selectedItem ? (
          <div className="mt-2">
            <p className="text-solo-secondary mb-4">How may I assist you today, my Liege?</p>
            
            <Accordion type="single" collapsible className="w-full">
              {helpData.map((category) => (
                <AccordionItem key={category.id} value={category.id} className="border-b border-solo-secondary/20">
                  <AccordionTrigger className="text-solo-accent hover:text-solo-accent/80">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-2">
                      {category.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectQuestion(item)}
                          className="text-left p-2 hover:bg-solo-accent/10 rounded-md text-sm transition-colors"
                        >
                          {item.question}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="mt-2">
            <button
              onClick={handleBackToQuestions}
              className="text-solo-accent hover:text-solo-accent/80 mb-4 flex items-center text-sm"
            >
              ← Back to questions
            </button>
            
            <h3 className="font-semibold mb-2">{selectedItem.question}</h3>
            
            <div className="bg-solo-secondary/10 p-3 rounded-lg">
              <p className="text-sm">
                {displayText}
                {isTyping && <span className="animate-pulse ml-1">|</span>}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BeruHelpDialog;
