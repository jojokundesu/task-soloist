
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user as defaultUser, tasks as defaultTasks, skills, achievements } from '@/data/mockData';
import HeroCard from '@/components/home/hero-card';
import DailyTasks from '@/components/home/daily-tasks';
import SkillsSection from '@/components/home/skills-section';
import AchievementsSection from '@/components/home/achievements-section';
import MeditationSection from '@/components/home/meditation-section';
import { getTasks, getUser, setUser } from '@/services/storageService';
import { Task, User } from '@/types';
import Onboarding from '@/components/intro/Onboarding';
import { UserData } from '@/components/intro/BeruDialog';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [user, setUserState] = useState<User>(defaultUser);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    console.log("Index component mounted");
    const storedTasks = getTasks();
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
    
    const storedUser = getUser();
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    console.log("Onboarding completed:", onboardingCompleted);
    
    if (storedUser) {
      setUserState(storedUser);
    }
    
    if (!onboardingCompleted) {
      console.log("Setting up onboarding");
      // Show onboarding immediately
      setShowOnboarding(true);
    } else {
      setAppInitialized(true);
    }
  }, []);

  const handleOnboardingComplete = (userData: UserData) => {
    console.log("Onboarding complete callback with userData:", userData);
    
    const updatedUser = {
      ...defaultUser,
      name: userData.name,
      stats: {
        ...defaultUser.stats,
        strength: userData.bodyFatPercentage < 15 ? 8 : 10,
        endurance: userData.bodyFatPercentage > 25 ? 8 : 10,
      }
    };
    
    // Update state first
    setUserState(updatedUser);
    // Save to localStorage
    setUser(updatedUser);
    
    // Set flag to prevent showing onboarding again
    localStorage.setItem('onboarding_completed', 'true');
    
    // Update UI state
    setShowOnboarding(false);
    setAppInitialized(true);
    
    toast({
      title: "Welcome, Shadow Monarch!",
      description: "Your journey to becoming the strongest hunter begins now.",
    });
  };

  // Show loading state if app is not initialized and onboarding is not shown
  if (!appInitialized && !showOnboarding) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-solo-bg">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <div className={`min-h-screen pb-20 pt-20 ${showOnboarding ? 'hidden' : 'block'}`}>
        <div className="container mx-auto px-4 max-w-lg">
          <div className="space-y-6">
            <div className="text-center mb-4 mt-4 animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
                Task Soloist
              </h1>
              <p className="text-solo-secondary mt-2">Level up through daily achievements</p>
            </div>
            
            <HeroCard user={user} className="animate-scale-in" />
            
            <DailyTasks tasks={tasks} className="animate-scale-in" />
            
            <MeditationSection className="animate-scale-in" />
            
            <SkillsSection skills={skills} className="animate-scale-in" />
            
            <AchievementsSection achievements={achievements} className="animate-scale-in" />
          </div>
        </div>
        
        <NavBar />
      </div>
    </>
  );
};

export default Index;
