
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { ArrowLeft, Info, Play, X, Clock, Brain, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getPublicMeditations, getSecretMeditation } from '@/data/meditationData';
import { innerEngineeringLink } from '@/data/meditationData';
import GlassCard from '@/components/ui/glass-card';
import { Meditation as MeditationType } from '@/types';
import { updateMeditationStreak, checkSecretMeditationUnlocked, getMeditationStreak } from '@/services/storageService';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

const MeditationItem = ({ 
  meditation, 
  onSelect 
}: { 
  meditation: MeditationType, 
  onSelect: (med: MeditationType) => void 
}) => {
  // Get icon dynamically
  const IconComponent = (() => {
    switch(meditation.icon) {
      case 'brain': return Brain;
      case 'flower': return (props: any) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          {...props}
        >
          <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 0 4.5-4.5M12 16.5V15m4.5-3H15" />
          <circle cx="12" cy="12" r="3" />
          <path d="m8 8 1 1" />
          <path d="m15 15 1 1" />
          <path d="m8 16 1-1" />
          <path d="m15 9 1-1" />
        </svg>
      );
      case 'heart': return (props: any) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          {...props}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
      case 'wind': return (props: any) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          {...props}
        >
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
          <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
          <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        </svg>
      );
      case 'zap': return (props: any) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          {...props}
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
      case 'eye': return (props: any) => (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          {...props}
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
      default: return Brain;
    }
  })();

  return (
    <GlassCard 
      className="p-4 mb-4 hover:border-solo-accent/40" 
      onClick={() => onSelect(meditation)}
    >
      <div className="flex items-start">
        <div className="bg-solo-accent/20 p-3 rounded-lg mr-4">
          <IconComponent className="h-6 w-6 text-solo-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{meditation.name}</h3>
          <p className="text-xs text-solo-secondary mb-2">By {meditation.teacher}</p>
          <p className="text-sm text-solo-secondary truncate">{meditation.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-xs text-solo-secondary mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{meditation.duration[0]}-{meditation.duration[meditation.duration.length-1]} min</span>
          </div>
          <Button size="sm" variant="ghost" className="bg-solo-accent/20 text-solo-accent hover:bg-solo-accent/30">
            <Play className="h-4 w-4 mr-1" /> Start
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

const Timer = ({ 
  duration, 
  isActive, 
  onComplete 
}: { 
  duration: number, 
  isActive: boolean, 
  onComplete: () => void 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            onComplete();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="text-6xl font-bold text-center my-8">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

const MeditationPage = () => {
  const [selectedTab, setSelectedTab] = useState('techniques');
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showMeditationComplete, setShowMeditationComplete] = useState(false);
  const { toast } = useToast();
  const publicMeditations = getPublicMeditations();
  const secretMeditation = getSecretMeditation();
  const isSecretUnlocked = checkSecretMeditationUnlocked();
  
  const handleMeditationSelect = (meditation: MeditationType) => {
    setSelectedMeditation(meditation);
    setSelectedDuration(null);
  };
  
  const handleStartMeditation = () => {
    if (!selectedDuration) return;
    setIsTimerActive(true);
  };
  
  const handleTimerComplete = () => {
    setIsTimerActive(false);
    updateMeditationStreak();
    setShowMeditationComplete(true);
    
    // Play gentle sound to indicate completion
    try {
      const audio = new Audio('/meditation-complete.mp3');
      audio.play();
    } catch(e) {
      console.error('Could not play completion sound');
    }
  };
  
  const handleCompletionClose = () => {
    setShowMeditationComplete(false);
    setSelectedMeditation(null);
    setSelectedDuration(null);
    
    toast({
      title: "Meditation Completed",
      description: "Great job! Your streak has been updated.",
    });
  };
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Meditation</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Meditation</DialogTitle>
                <DialogDescription>
                  Regular meditation practice helps improve focus, reduce stress, and increase mental clarity. 
                  Consistent 7-day practice unlocks a special meditation technique.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm">
                  The techniques provided here are inspired by teachings from Osho, Sadhguru, and ancient yogic practices.
                </p>
                <p className="text-sm">
                  For the best results, practice at the same time each day and find a quiet place where you won't be disturbed.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* If a meditation is selected, show details */}
        {selectedMeditation ? (
          <div className="animate-fade-in">
            {!isTimerActive ? (
              /* Meditation Setup */
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-4" 
                  onClick={() => setSelectedMeditation(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to techniques
                </Button>
                
                <h2 className="text-xl font-bold mb-2">{selectedMeditation.name}</h2>
                <p className="text-sm text-solo-secondary mb-4">By {selectedMeditation.teacher}</p>
                
                <div className="bg-black/20 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-solo-secondary mb-4">{selectedMeditation.description}</p>
                  
                  <h3 className="font-medium mb-2">Instructions</h3>
                  <p className="text-sm text-solo-secondary mb-4">{selectedMeditation.instructions}</p>
                  
                  <h3 className="font-medium mb-2">Precautions</h3>
                  <p className="text-sm text-solo-secondary mb-4">{selectedMeditation.precautions}</p>
                  
                  <h3 className="font-medium mb-2">Benefits</h3>
                  <p className="text-sm text-solo-secondary">{selectedMeditation.benefits}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Select Duration</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeditation.duration.map(duration => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? "default" : "outline"}
                        className={selectedDuration === duration ? "bg-solo-accent" : ""}
                        onClick={() => setSelectedDuration(duration)}
                      >
                        {duration} min
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-solo-accent hover:bg-solo-highlight"
                  disabled={!selectedDuration}
                  onClick={handleStartMeditation}
                >
                  <Play className="h-4 w-4 mr-2" /> Start Meditation
                </Button>
                
                {selectedMeditation.isSecret && (
                  <div className="mt-6 p-4 border border-solo-highlight/30 bg-solo-highlight/10 rounded-lg">
                    <h3 className="font-medium text-solo-highlight mb-2">Important Note</h3>
                    <p className="text-sm mb-3">
                      Shambhavi Mahamudra is a sacred kriya that should only be learned through proper initiation. 
                      For the authentic experience and proper guidance, consider Sadhguru's Inner Engineering program.
                    </p>
                    <a 
                      href={innerEngineeringLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solo-highlight text-sm flex items-center"
                    >
                      Learn more about Inner Engineering
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Meditation Timer */
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">{selectedMeditation.name}</h2>
                <p className="text-sm text-solo-secondary mb-6">Focus on your breath and follow the instructions</p>
                
                <Timer 
                  duration={selectedDuration || 5} 
                  isActive={isTimerActive} 
                  onComplete={handleTimerComplete} 
                />
                
                <div className="mb-6 p-4 bg-black/20 rounded-lg text-start">
                  <h3 className="font-medium mb-2">Remember</h3>
                  <ul className="text-sm text-solo-secondary list-disc pl-5 space-y-2">
                    <li>If your mind wanders, gently bring it back</li>
                    <li>Focus on your breath if you feel distracted</li>
                    <li>Stay in a comfortable position</li>
                    <li>Allow thoughts to come and go without judgment</li>
                  </ul>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={() => setIsTimerActive(false)}
                >
                  <X className="h-4 w-4 mr-2" /> End Session
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Meditation List */
          <Tabs 
            defaultValue="techniques" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="techniques">Techniques</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="techniques" className="animate-fade-in">
              <div className="space-y-4">
                {publicMeditations.map(meditation => (
                  <MeditationItem 
                    key={meditation.id} 
                    meditation={meditation} 
                    onSelect={handleMeditationSelect} 
                  />
                ))}
                
                {isSecretUnlocked && secretMeditation && (
                  <div className="mt-8">
                    <div className="text-center mb-4">
                      <div className="inline-block px-4 py-2 bg-solo-highlight/20 text-solo-highlight rounded-full text-sm font-medium">
                        Secret Technique Unlocked!
                      </div>
                    </div>
                    <MeditationItem 
                      meditation={secretMeditation} 
                      onSelect={handleMeditationSelect} 
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="animate-fade-in">
              <div className="bg-black/20 rounded-lg p-6 text-center mb-6">
                <div className="text-3xl font-bold text-solo-accent mb-2">
                  {getMeditationStreak()}
                </div>
                <div className="text-sm text-solo-secondary mb-4">
                  Day Streak
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-solo-accent to-solo-highlight rounded-full"
                    style={{ width: `${Math.min((getMeditationStreak() / 7) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-solo-secondary">
                  {isSecretUnlocked 
                    ? "Secret technique unlocked! 🎉" 
                    : `${7 - getMeditationStreak()} more days until secret technique`}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">Meditation Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                      <Brain className="h-5 w-5 text-solo-accent" />
                    </div>
                    <div>
                      <div className="font-medium">Mental Clarity</div>
                      <div className="text-xs text-solo-secondary">Enhances focus and reduces mental fog</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-5 w-5 text-solo-accent"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Emotional Balance</div>
                      <div className="text-xs text-solo-secondary">Develops resilience to stress and anxiety</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-5 w-5 text-solo-accent"
                      >
                        <path d="M20.2 6.5A9 9 0 0 0 12 2a9 9 0 0 0-8.2 4.5" />
                        <path d="M13 22h-2a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1Z" />
                        <path d="M19 22h-2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1Z" />
                        <path d="M7 22H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Enhanced Performance</div>
                      <div className="text-xs text-solo-secondary">Improves stats and abilities in daily tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Completion Modal */}
      <Dialog open={showMeditationComplete} onOpenChange={setShowMeditationComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meditation Complete</DialogTitle>
            <DialogDescription>
              Great job completing your meditation session!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-solo-accent/20 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-solo-accent" />
            </div>
            <p className="text-center mb-2">
              You've gained mental clarity and focus.
            </p>
            <p className="text-sm text-solo-secondary text-center">
              Your meditation streak is now: <span className="font-bold text-solo-accent">{getMeditationStreak()} days</span>
            </p>
            
            {getMeditationStreak() === 7 && (
              <div className="mt-4 p-3 bg-solo-highlight/10 border border-solo-highlight/30 rounded-lg text-center">
                <p className="text-sm font-medium text-solo-highlight">
                  🎉 You've unlocked the secret meditation technique!
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={handleCompletionClose}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </div>
  );
};

export default MeditationPage;
