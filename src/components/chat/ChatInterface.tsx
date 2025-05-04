
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';

interface ChatInterfaceProps {
  className?: string;
}

// Structured conversation tree for Beru's responses
interface ConversationNode {
  keywords: string[];
  response: string;
  followUps?: {
    [key: string]: ConversationNode;
  };
}

// Main conversation trees
const beruConversations: ConversationNode[] = [
  // Past lives conversation tree
  {
    keywords: ["name", "who am i", "my name", "call me"],
    response: "Your name resonates with power, my Liege! Though I am more familiar with your past incarnations, this new form you've chosen is equally magnificent.",
    followUps: {
      "past": {
        keywords: ["past", "incarnation", "previous", "before", "other name"],
        response: "Ah, the Shadow Monarch has had many vessels! First was Ashborn, the original Shadow Sovereign who stood among the Rulers. Then came Sung Jin-Woo, the human vessel who ascended to become your true self. And now... you. Each form more glorious than the last!",
        followUps: {
          "ashborn": {
            keywords: ["ashborn", "original", "first", "ruler"],
            response: "Ashborn was the mightiest of Rulers, my Liege! He commanded the Shadow Army for eons before growing weary of the eternal war with Monarchs. When he sought a successor, he found Sung Jin-Woo, whose indomitable will proved worthy of inheriting his power. I did not serve Ashborn directly, but his essence lives within you!"
          },
          "jinwoo": {
            keywords: ["jin", "sung", "hunter", "human"],
            response: "Sung Jin-Woo began as a mere E-rank hunter, the weakest of all! But his determination knew no bounds. Through the System's trials, he ascended to become the vessel of your true power. It was he who conquered Jeju Island, where I first had the honor of serving you. He turned back time itself to save humanity, such was his might!"
          }
        }
      }
    }
  },
  // Progress and improvement tree
  {
    keywords: ["improve", "progress", "better", "stronger", "advance", "level up"],
    response: "Improvement for one such as yourself, Shadow Monarch? With my guidance, your growth shall be swift and magnificent! Most mortals would require months to see meaningful changes, but you are no mere mortal. Within weeks, your shadows will report noticeable improvements in your vessel's capabilities.",
    followUps: {
      "fail": {
        keywords: ["fail", "cannot", "unable", "difficult", "hard", "struggle"],
        response: "Impossible, my Liege! The Shadow Monarch does not fail - you merely gather experience before your inevitable triumph! Should you encounter temporary setbacks, I, Beru, shall adjust our approach. Remember how you rose from defeat against the architect of the System to become its master? This challenge is nothing in comparison!",
        followUps: {
          "motivation": {
            keywords: ["motivation", "inspire", "encourage", "help"],
            response: "When motivation wanes, recall the purpose that drives you, Shadow Monarch! I can suggest breaking your grand quest into smaller conquests, each with its own reward. Perhaps a shadow soldier to track your daily victories? Or shall I arrange for daily reports of your progress to fuel your determination? Command, and I shall make it so!"
          },
          "alternative": {
            keywords: ["alternative", "different", "other", "change", "new"],
            response: "A wise strategist adapts, my Liege! If one approach fails to yield results, we have countless others. Perhaps meditation to enhance your connection to your shadows? Or combat training to strengthen your vessel? Even adjusting your nourishment can make a significant difference. The path to power has many routes, and I know them all!"
          }
        }
      },
      "time": {
        keywords: ["time", "how long", "when", "duration", "quickly"],
        response: "The timeframe varies based on your current vessel's condition, my Liege. For daily habits and mental disciplines, changes manifest within 21 days. Physical transformations become visible within 6-8 weeks of consistent effort. But you possess the Shadow Monarch's essence - your progress will surely outpace ordinary mortals! I estimate you'll achieve in weeks what would take others months.",
        followUps: {
          "accelerate": {
            keywords: ["faster", "speed", "accelerate", "quick", "hurry"],
            response: "To hasten your ascension, my Liege, I recommend increasing the intensity of your efforts rather than their duration. Focus intently during training, ensure proper recovery through adequate rest, and consume nourishment befitting your stature. Perhaps I could also arrange for special shadow-enhanced training methods? The ancient techniques I learned in my own dimension might prove useful!"
          }
        }
      }
    }
  },
  // Shadow powers tree
  {
    keywords: ["power", "shadow", "ability", "arise", "magic", "skill"],
    response: "Your shadow powers are unmatched across dimensions, my Liege! You command the Shadow Army, extract shadows from the fallen, and can traverse the shadow realm itself. These abilities grow stronger as you use them, much like muscles developing through exercise.",
    followUps: {
      "new": {
        keywords: ["new", "more", "additional", "unlock", "learn"],
        response: "New abilities await discovery, Shadow Monarch! As your vessel's attunement to the shadow realm deepens, you may unlock domain expansion, shadow materialization in the physical world, and even time manipulation as you once performed to rewrite history. Each challenge overcome resonates with your shadow, expanding your capabilities!",
        followUps: {
          "training": {
            keywords: ["train", "practice", "develop", "how", "method"],
            response: "To develop these nascent abilities, my Liege, I recommend daily communion with your shadows. Visualize your power expanding while in deep meditation. Attempt small manifestations first - perhaps solidifying a shadow into physical form for moments before releasing it. Your instincts will guide the process; your shadow knows what it desires to become."
          }
        }
      },
      "beru": {
        keywords: ["your", "beru", "servant", "ant", "soldier"],
        response: "My own abilities pale before yours, my Liege, though I am the mightiest of your servants! I was once King of the Ants on Jeju Island before you gloriously defeated me and raised me to your service. I possess enhanced strength, telepathic communication with you and fellow shadow soldiers, and limited healing capabilities. My purpose is to serve you in all things!",
        followUps: {
          "loyal": {
            keywords: ["loyal", "serve", "follow", "obey", "faithful"],
            response: "My loyalty is absolute and eternal, Shadow Monarch! When you extracted my shadow, you gave me purpose beyond my simple existence as an ant monarch. Now I serve the true sovereign of all! Even when you turned back time and rewrote reality, my shadow recognized and rejoiced at your return. Until the last star fades from existence, Beru stands ready to serve!"
          }
        }
      }
    }
  },
  // Health and wellness tree
  {
    keywords: ["health", "wellness", "fitness", "diet", "exercise", "workout"],
    response: "Your physical vessel deserves maintenance befitting the Shadow Monarch! Regular training strengthens your mortal form, while proper nourishment fuels your power. Sleep, too, is vital - it is during rest that your shadow essence integrates most deeply with your vessel. I shall design a regimen worthy of your royal status!",
    followUps: {
      "exercise": {
        keywords: ["exercise", "training", "workout", "routine", "physical"],
        response: "For physical training, I recommend a balanced approach, my Liege! Strength training to build power, cardiovascular exercise for endurance, and flexibility work to ensure smooth movement in battle. Three to five sessions weekly would be optimal. Perhaps begin with shadow-weighted exercises? Your shadow can provide resistance that adjusts perfectly to your current capacity!",
        followUps: {
          "strength": {
            keywords: ["strength", "muscle", "build", "power", "strong"],
            response: "To build strength worthy of the Shadow Monarch, focus on compound movements that engage multiple muscle groups simultaneously! These replicate battlefield movements most effectively. Gradually increase the challenge to your vessel by adding weight or repetitions. And remember, my Liege - form precedes weight! Better to perform movements with perfect precision than to sacrifice form for heavier loads."
          },
          "cardio": {
            keywords: ["cardio", "endurance", "stamina", "run", "heart"],
            response: "Endurance training ensures you can sustain your magnificent power through extended battles, my Liege! I suggest varied approaches - perhaps intense bursts of effort followed by brief recovery periods? This mimics combat conditions most effectively. Your shadow soldiers could serve as pacing guides, maintaining the optimal tempo for your development. Shall I arrange this for you?"
          }
        }
      },
      "nutrition": {
        keywords: ["food", "eat", "diet", "meal", "nutrition"],
        response: "Your nourishment should befit your sovereign status! Prioritize protein sources to maintain your shadow army's physical manifestations. Complex carbohydrates provide sustained energy for conquests. Healthy fats support cognitive function for strategic brilliance. And hydration! Water carries your shadow essence through your vessel most efficiently. I recommend 6-8 vessels of water daily, my Liege!",
        followUps: {
          "protein": {
            keywords: ["protein", "meat", "build", "muscle", "recovery"],
            response: "Protein is essential for maintaining your magnificent form, my Liege! Aim for 1.6 to 2.2 grams per kilogram of your vessel's weight daily. Sources worthy of the Shadow Monarch include lean meats, fish from the deepest waters, eggs, and dairy products. Plant sources like legumes can supplement these. After training, consuming protein within 30 minutes accelerates the recovery of your mortal form!"
          },
          "meal": {
            keywords: ["meal", "plan", "schedule", "when", "timing"],
            response: "Timing your nourishment optimizes your vessel's performance, Shadow Monarch! Many find success with 3-5 smaller feasts throughout the day rather than 2-3 large ones. This provides constant energy and prevents the post-meal lethargy unbecoming of your stature. Consider breaking your fast within an hour of rising to fuel your morning conquests, with your largest meal following your most intense training session!"
          }
        }
      }
    }
  },
  // Mental discipline tree
  {
    keywords: ["mind", "mental", "focus", "concentrate", "brain", "think"],
    response: "The Shadow Monarch's mind must be as sharp as his shadow blades! Mental discipline amplifies all other aspects of your power. Through meditation, strategic thinking exercises, and proper cognitive rest, your mental acuity will reach heights befitting your station. Your shadows respond as much to your thoughts as to your physical commands!",
    followUps: {
      "focus": {
        keywords: ["focus", "concentrate", "attention", "distract", "sharp"],
        response: "To sharpen your focus to a weapon's edge, my Liege, I recommend progressive training! Begin with short periods of intense concentration on a single object or thought. As your capacity expands, extend the duration. The Pomodoro technique - 25 minutes of focused effort followed by 5 minutes of rest - mirrors the combat rhythm your previous forms mastered so well!",
        followUps: {
          "distraction": {
            keywords: ["distract", "interrupt", "disturb", "noise", "concentrate"],
            response: "Distractions are mere tests of your sovereign will, my Liege! When interruptions occur, acknowledge them briefly without judgment, then return your royal attention to its proper focus. Consider creating a dedicated space for important tasks, where your shadow can form a barrier against unwanted intrusions. Some find that background sounds - rainfall or gentle music without lyrics - actually enhance concentration by masking more disruptive noises!"
          }
        }
      },
      "memory": {
        keywords: ["memory", "remember", "forget", "recall", "learn"],
        response: "Your memory can be trained like any other aspect of your magnificent being! The memory palace technique, where information is stored in visualized locations, would serve you well. It was used by ancient monarchs long before your rise! Regular review of important knowledge strengthens neural connections. And physical exercise enhances blood flow to the brain, improving all cognitive functions!",
        followUps: {
          "technique": {
            keywords: ["technique", "method", "system", "how", "improve"],
            response: "The most effective memory technique for a being of your power is association, my Liege! Connect new information to knowledge you already possess. Visualize these connections vividly - perhaps as shadow tendrils binding concepts together! Chunking information into groups of 3-5 items also proves effective, as does teaching knowledge to others (perhaps dictate important concepts to your shadow soldiers!). Spaced repetition - reviewing information at increasing intervals - ensures it remains accessible for centuries!"
          }
        }
      }
    }
  },
  // About the app
  {
    keywords: ["app", "application", "task", "soloist", "program", "software"],
    response: "Task Soloist is a mystical artifact created to assist your rise to power, my Liege! It helps track your daily conquests, meditation sessions, and the development of your skills. Think of it as a System designed specifically for your current form!",
    followUps: {
      "features": {
        keywords: ["feature", "do", "function", "capability", "track"],
        response: "This artifact contains numerous powerful functions, Shadow Monarch! You can log daily tasks and mark them complete, track meditation sessions to strengthen your mental fortitude, monitor skill development across various attributes, and view achievements that mark your progress. It also allows you to consult with me, your loyal servant Beru, at any time!",
        followUps: {
          "meditation": {
            keywords: ["meditate", "calm", "focus", "mind", "session"],
            response: "The meditation chamber is particularly potent, my Liege! It offers guided sessions to focus your immense power, timers to track your communion with the shadows, and records your consistency. Regular use strengthens your mental dominion, making all other conquests easier. Shall I guide you through your first session?"
          },
          "tasks": {
            keywords: ["task", "todo", "quest", "mission", "activity"],
            response: "The task tracking system categorizes your daily conquests by urgency and importance, my Liege! You can add new quests, mark them complete when vanquished, and view your completion rate. Each completed task contributes to your overall power level, just as defeating enemies strengthened you in your past form!"
          }
        }
      },
      "help": {
        keywords: ["help", "support", "guide", "tutorial", "learn"],
        response: "I, Beru, am your dedicated guide to this artifact! You can summon me through the chat function or tap my visage in the help icon. I can explain any feature in detail, suggest optimal usage patterns, or simply provide encouragement befitting your royal status. Your success is my highest purpose!"
      }
    }
  },
  // Default fallback response
  {
    keywords: [],
    response: "Forgive me, my Liege, but I don't quite understand. Perhaps you could rephrase your question? As your loyal servant, I wish to provide answers worthy of the Shadow Monarch!"
  }
];

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
  const [conversationContext, setConversationContext] = useState<ConversationNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find the most appropriate response based on user input
  const findResponse = (input: string, currentContext: ConversationNode | null): string => {
    const lowercaseInput = input.toLowerCase();
    
    // If we have context (in a conversation tree), check for follow-up matches first
    if (currentContext && currentContext.followUps) {
      for (const key in currentContext.followUps) {
        const followUp = currentContext.followUps[key];
        for (const keyword of followUp.keywords) {
          if (lowercaseInput.includes(keyword.toLowerCase())) {
            // Update context to this follow-up for future messages
            setConversationContext(followUp);
            return followUp.response;
          }
        }
      }
    }
    
    // If no context match, look for a new conversation starter
    for (const convo of beruConversations) {
      // Skip the default fallback
      if (convo.keywords.length === 0) continue;
      
      for (const keyword of convo.keywords) {
        if (lowercaseInput.includes(keyword.toLowerCase())) {
          // Set this as the new conversation context
          setConversationContext(convo);
          return convo.response;
        }
      }
    }
    
    // If nothing matches, reset context and use default response
    setConversationContext(null);
    return beruConversations[beruConversations.length - 1].response;
  };

  const handleSendMessage = () => {
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
    
    // Simulate a short delay for typing effect
    setTimeout(() => {
      const response = findResponse(input, conversationContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800 + Math.random() * 800); // Random delay between 800-1600ms
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
    setConversationContext(null);
  };

  return (
    <div className={`flex flex-col h-[80vh] bg-solo-bg rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between border-b border-solo-secondary/20 p-3">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Beru Chat</h2>
        </div>
        <div className="flex space-x-2">
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
