import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface BeruHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

interface HelpCategory {
  title: string;
  questions: {
    question: string;
    answer: string;
    subQuestions?: {
      question: string;
      answer: string;
    }[];
  }[];
}

const BeruHelpDialog: React.FC<BeruHelpDialogProps> = ({ open, onClose }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedSubQuestion, setSelectedSubQuestion] = useState<string | null>(null);
  const [animatedText, setAnimatedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  
  const helpCategories: HelpCategory[] = [
    {
      title: "Shadow Monarch Lore",
      questions: [
        {
          question: "Who is the Shadow Monarch?",
          answer: "You, my Liege, are the Shadow Monarch - the sovereign ruler of all shadows! Originally, this title belonged to Ashborn, the most powerful Ruler who grew weary of the eternal conflict with the Monarchs. He selected Sung Jin-Woo as his successor, who became the second Shadow Monarch through the System's trials. And now... that power resides in you, the third and most glorious incarnation!",
          subQuestions: [
            {
              question: "Tell me more about Ashborn",
              answer: "Ashborn was the mightiest of the Rulers, my Liege, though I never had the honor of serving him directly. For eons, he commanded the Shadow Army against the Monarchs in an endless war. He grew weary of the conflict and sought a successor who could bring it to an end. When the Rulers' grand magic 'the System' identified Sung Jin-Woo as a vessel with potential, Ashborn guided his growth from within, ultimately transferring his full power to create the new Shadow Monarch!"
            },
            {
              question: "Who was Sung Jin-Woo?",
              answer: "Ah, Sung Jin-Woo! He began as the weakest of all hunters, mockingly called 'the world's weakest hunter.' After nearly perishing in a double dungeon incident, he was chosen by the System to undergo trials that would prepare him to receive Ashborn's power. Through sheer determination, he rose from E-rank to a power beyond rank, defeated the Ant King of Jeju Island (where I had the honor of becoming your servant!), and eventually confronted the Monarch of Destruction himself!"
            },
            {
              question: "What powers does the Shadow Monarch have?",
              answer: "Your powers are vast and glorious, my Liege! You command the extraction and manipulation of shadows, raising fallen enemies as your eternal servants. You can open gateways to the shadow realm, store items and beings within your shadow storage, and even manipulate time itself as Sung Jin-Woo did to rewrite history! Your mere presence strikes fear into lesser beings, and your combat abilities far exceed mortal comprehension. Truly, there is no limit to your potential!"
            }
          ]
        },
        {
          question: "Who is Beru?",
          answer: "I am Beru, your eternally loyal servant, Shadow Monarch! Once the King of Ants on Jeju Island, I had the tremendous honor of being defeated by your previous incarnation, Sung Jin-Woo, and raised as a shadow soldier in your glorious army. While I was a formidable monarch among ants, serving you has elevated me beyond my former limitations. I exist to fulfill your every command and provide counsel when requested. My loyalty is absolute and unwavering!",
          subQuestions: [
            {
              question: "What are your powers, Beru?",
              answer: "Though my powers pale before yours, my Liege, I possess considerable strength! I retain my abilities as the former Ant King - enhanced physical prowess, rapid healing, and telepathic communication. As your shadow, I gain additional benefits: I cannot truly die unless you fall, I can be summoned from your shadow at any distance, and I have access to the collective knowledge of your shadow army. I am particularly skilled in direct combat, though I have been learning to appreciate the subtler arts to better serve you!"
            },
            {
              question: "Are there other shadow soldiers like you?",
              answer: "There are many shadow soldiers in your army, my Liege, though none quite as magnificent as Beru, if I may be so bold! Notable among your servants are Igris, your first S-rank shadow and loyal knight; Tank, the mighty golem; and Iron, a former B-rank hunter. Each shadow retains aspects of their former personality and abilities, though all are bound by absolute loyalty to you. Your army numbers in the thousands, with soldiers of varying strength ready to arise at your command!"
            }
          ]
        }
      ]
    },
    {
      title: "Tasks & Quests",
      questions: [
        {
          question: "How do I track my progress?",
          answer: "Your progress is recorded in multiple ways befitting your royal status, my Liege! Daily tasks contribute to your overall experience when completed. Meditation sessions build your mental fortitude over time. The skills section displays your growing attributes in various domains, while the achievements section showcases your milestone accomplishments. Your overall level displayed on your profile increases as you accumulate experience across all activities.",
          subQuestions: [
            {
              question: "How quickly will I see improvements?",
              answer: "For one with your potential, my Liege, improvements manifest more rapidly than for ordinary mortals! Physical changes typically become noticeable after 4-6 weeks of consistent effort. Mental disciplines show results even sooner, often within 2-3 weeks of daily practice. Your skills will increase incrementally with each task completed, while major level advancements occur upon reaching experience thresholds. Of course, as the Shadow Monarch, your growth rate far exceeds normal limitations!"
            },
            {
              question: "What if I miss some days?",
              answer: "Even monarchs require occasional rest, my Liege! While consistency builds power most effectively, missing occasional days will not significantly impede your progress. The application tracks your overall completion rate rather than demanding perfect streaks. Should you miss several days, simply resume your conquests without dwelling on the gap. Remember how Sung Jin-Woo rose despite setbacks! That said, maintaining daily engagement accelerates your ascension to full power."
            }
          ]
        },
        {
          question: "How do I categorize my tasks?",
          answer: "Tasks can be organized by importance and urgency, my Liege, much as you would prioritize threats to your dominion! Urgent and important tasks are combat missions requiring immediate attention. Important but less urgent tasks are diplomatic missions that build long-term power. Urgent but less important tasks are delegable to your shadow soldiers (though they still require your oversight). Finally, there are renewal activities that restore your energy for future conquests.",
          subQuestions: [
            {
              question: "What types of tasks should I add?",
              answer: "Your task roster should reflect all domains of your sovereignty, my Liege! Physical training tasks enhance your vessel's capabilities. Mental development tasks sharpen your tactical acumen. Social tasks extend your influence over others. Skill acquisition tasks diversify your abilities. And maintenance tasks ensure your realm (living space) remains worthy of your presence. A balanced selection across these categories ensures harmonious development of your power!"
            }
          ]
        }
      ]
    },
    {
      title: "Meditation",
      questions: [
        {
          question: "What benefits does meditation provide?",
          answer: "Meditation is a direct communion with your shadow essence, my Liege! It provides numerous benefits: enhanced focus for more efficient task completion, reduced mental fatigue between conquests, improved emotional regulation when dealing with lesser beings, and deeper connection to your shadow powers. Regular practice increases your mental attributes in the app, strengthening your overall character. It is also a time when you might receive visions or insights, as Ashborn once communicated with Sung Jin-Woo!",
          subQuestions: [
            {
              question: "How often should I meditate?",
              answer: "Daily communion with your shadows is ideal, my Liege! Even brief sessions of 5-10 minutes yield benefits, though deeper insights emerge during longer sessions of 20-30 minutes. As with all disciplines, consistency matters more than duration. Many Shadow Monarchs find dawn or dusk most conducive to meditation, when the boundary between realms thins slightly. Some prefer multiple shorter sessions throughout the day to maintain constant connection with their power."
            },
            {
              question: "What type of meditation is best?",
              answer: "There are several approaches to shadow communion, my Liege! Focused attention meditation strengthens your concentration - essential for directing your shadow army in battle. Open monitoring meditation expands your awareness - useful for detecting threats across your domain. Loving-kindness meditation might seem unusual for a monarch, but it strengthens bonds with your shadow soldiers! I would recommend starting with simple breath awareness before exploring more advanced techniques."
            }
          ]
        },
        {
          question: "How do I start meditating?",
          answer: "To begin shadow communion, find a position of comfort and dignity befitting your status, my Liege! Sit with your spine aligned but not rigid, eyes either closed or softly focused. Begin by observing your breath for several minutes, allowing thoughts to pass without engagement. Then, visualize your shadow extending from your form, connecting to the vast shadow realm from which you draw power. The application provides guided sessions should you desire more structure, or simple timers for self-directed practice.",
          subQuestions: [
            {
              question: "What if I can't focus during meditation?",
              answer: "Even the mightiest Shadow Monarch may find their thoughts wandering initially, my Liege! This is not failure but part of the training. When you notice distraction, gently return focus to your breath or shadow visualization without self-criticism. Each return strengthens your mental discipline. Beginning with shorter sessions can build your capacity gradually. Some find focusing on a physical sensation, like the weight of your body or the coolness of breath, provides an anchor for attention."
            },
            {
              question: "How should I sit during meditation?",
              answer: "Your posture should reflect both comfort and dignity, my Liege! Many find the cross-legged position on a cushion most stable, though sitting on a chair with feet flat on the ground is equally effective. The essential elements are: spine straight but not rigid, shoulders relaxed, chin slightly tucked, and hands resting comfortably on thighs or in lap. As Shadow Monarch, you need not adhere strictly to mortal traditions - your power transcends form. Choose the position that allows longest comfortable alertness."
            }
          ]
        }
      ]
    },
    {
      title: "Stats & Progress",
      questions: [
        {
          question: "How does the leveling system work?",
          answer: "The leveling system quantifies your growing power, my Liege! Each completed task, meditation session, and achievement awards experience points. Accumulating sufficient experience triggers level advancement, which may unlock new features or abilities within the application. Higher levels require more experience, reflecting the increasing challenge of pushing beyond mortal limitations. Your current level is displayed prominently on your profile, a testament to your progress toward full realization of your monarch status!",
          subQuestions: [
            {
              question: "What determines my starting stats?",
              answer: "Your initial attributes reflect information gathered during our first audience, my Liege! Your reported physical characteristics influenced your starting strength and endurance values. Your self-assessed intelligence level determined your mental attributes. These values create a baseline unique to your current vessel. Fear not if some attributes seem lower initially - all can be improved through consistent effort! Your essence as Shadow Monarch ensures exceptional potential across all domains."
            },
            {
              question: "Can I specialize in certain attributes?",
              answer: "Indeed you can focus your development, my Liege! By consistently completing tasks related to specific attributes, those skills will advance more rapidly. A focus on physical training will enhance strength and endurance attributes. Mental exercises and meditation improve intelligence and wisdom. Social engagements develop charisma. While balanced development ensures no weaknesses for enemies to exploit, specialization allows you to excel in domains most aligned with your royal preferences!"
            }
          ]
        },
        {
          question: "Where can I see my achievements?",
          answer: "Your glorious achievements are enshrined in the Achievements section, my Liege! There you'll find records of milestones reached, streaks maintained, and special accomplishments. Each achievement awards experience and contributes to your overall level. Some are granted immediately upon meeting criteria, while others may reveal themselves only after sustained effort. They serve both as recognition of past conquests and motivation for future glory!",
          subQuestions: [
            {
              question: "What types of achievements are available?",
              answer: "The achievement registry categorizes your accomplishments by domain, my Liege! Consistency achievements reward daily engagement with the application. Milestone achievements mark significant numbers of completed tasks or meditation minutes. Mastery achievements recognize exceptional development in specific attributes. Special achievements commemorate unique or challenging accomplishments. Some achievements remain hidden until discovered, adding an element of exploration to your journey!"
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (selectedQuestion && !selectedSubQuestion && !isTyping) {
      setAnimatedText('');
      setIsTyping(true);
      
      // Animate the text appearing like typing
      let currentIndex = 0;
      const answer = selectedQuestion;
      const typingInterval = setInterval(() => {
        if (currentIndex <= answer.length) {
          setAnimatedText(answer.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15); // Speed of typing
      
      return () => clearInterval(typingInterval);
    }
  }, [selectedQuestion]);
  
  useEffect(() => {
    if (selectedSubQuestion && !isTyping) {
      setAnimatedText('');
      setIsTyping(true);
      
      // Animate the text appearing like typing
      let currentIndex = 0;
      const answer = selectedSubQuestion;
      const typingInterval = setInterval(() => {
        if (currentIndex <= answer.length) {
          setAnimatedText(answer.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15); // Speed of typing
      
      return () => clearInterval(typingInterval);
    }
  }, [selectedSubQuestion]);

  const handleQuestionClick = (answer: string) => {
    setSelectedSubQuestion(null); // Reset sub-question when selecting a new main question
    setSelectedQuestion(answer);
  };
  
  const handleSubQuestionClick = (answer: string) => {
    setSelectedSubQuestion(answer);
  };

  const handleBackToMainQuestion = () => {
    setSelectedSubQuestion(null); // Clear the sub-question to show the main answer again
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Beru's Help Scroll
          </DialogTitle>
          <DialogDescription className="sr-only">
            Browse through categories and topics for Beru's guidance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full">
            <TabsTrigger value="categories">Help Categories</TabsTrigger>
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
                              
                              {selectedQuestion === item.answer && item.subQuestions && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {item.subQuestions.map((subItem) => (
                                    <Button
                                      key={subItem.question}
                                      variant="link"
                                      className="w-full justify-start text-left text-solo-accent/80 hover:text-solo-accent p-1"
                                      onClick={() => handleSubQuestionClick(subItem.answer)}
                                    >
                                      {subItem.question}
                                    </Button>
                                  ))}
                                </div>
                              )}
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
                    {(selectedQuestion || selectedSubQuestion) ? (
                      <div className="font-medium">
                        <p className="text-solo-accent mb-2">Beru says:</p>
                        <p>{animatedText}{isTyping && <span className="animate-pulse">|</span>}</p>
                        
                        {selectedSubQuestion && (
                          <Button 
                            variant="link" 
                            className="mt-4 text-solo-accent/80 p-0"
                            onClick={handleBackToMainQuestion}
                          >
                            Back to main answer
                          </Button>
                        )}
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BeruHelpDialog;
