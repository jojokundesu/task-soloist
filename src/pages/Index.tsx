
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user as defaultUser, tasks as defaultTasks, skills, achievements } from '@/data/mockData';
import HeroCard from '@/components/home/hero-card';
import DailyTasks from '@/components/home/daily-tasks';
import SkillsSection from '@/components/home/skills-section';
import AchievementsSection from '@/components/home/achievements-section';
import MeditationSection from '@/components/home/meditation-section';
import { getTasks, getUser, saveUser } from '@/services/storageService';
import { Task, User } from '@/types';
import Onboarding from '@/components/intro/Onboarding';
import { UserData } from '@/components/intro/BeruDialog';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [user, setUser] = useState<User>(defaultUser);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTasks = getTasks();
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
    
    const storedUser = getUser();
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    if (storedUser) {
      setUser(storedUser);
      setAppInitialized(true);
    }
    
    // Show onboarding only if it hasn't been completed
    if (!onboardingCompleted) {
      // Short delay to allow the app to render first
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    } else {
      setAppInitialized(true);
    }
  }, []);

  const handleOnboardingComplete = (userData: UserData) => {
    // Update user with data from onboarding
    const updatedUser = {
      ...defaultUser,
      name: userData.name,
      stats: {
        ...defaultUser.stats,
        // Optionally adjust starting stats based on user input
        strength: userData.bodyFatPercentage < 15 ? 8 : 10,
        endurance: userData.bodyFatPercentage > 25 ? 8 : 10,
      }
    };
    
    // Save updated user to storage
    setUser(updatedUser);
    saveUser(updatedUser);
    
    // Mark onboarding as completed
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    setAppInitialized(true);
    
    // Show welcome toast
    toast({
      title: "Welcome, Shadow Monarch!",
      description: "Your journey to becoming the strongest hunter begins now.",
    });
  };

  if (!appInitialized && !showOnboarding) {
    // Loading state before deciding what to show
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
      
      <div className={`min-h-screen pb-20 pt-20 ${showOnboarding ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <div className="container mx-auto px-4 max-w-lg">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center mb-4 mt-4 animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
                Task Soloist
              </h1>
              <p className="text-solo-secondary mt-2">Level up through daily achievements</p>
            </div>
            
            {/* Hero Status Card */}
            <HeroCard user={user} className="animate-scale-in" />
            
            {/* Daily Tasks */}
            <DailyTasks tasks={tasks} className="animate-scale-in" />
            
            {/* Meditation Section */}
            <MeditationSection className="animate-scale-in" />
            
            {/* Skills Section */}
            <SkillsSection skills={skills} className="animate-scale-in" />
            
            {/* Achievements Preview */}
            <AchievementsSection achievements={achievements} className="animate-scale-in" />
          </div>
        </div>
        
        {/* Navigation */}
        <NavBar />
      </div>
    </>
  );
};

export default Index;
