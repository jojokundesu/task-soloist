
import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user, tasks, skills, achievements } from '@/data/mockData';
import HeroCard from '@/components/home/hero-card';
import DailyTasks from '@/components/home/daily-tasks';
import SkillsSection from '@/components/home/skills-section';
import AchievementsSection from '@/components/home/achievements-section';

const Index = () => {
  return (
    <div className="min-h-screen pb-20 pt-20">
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
          
          {/* Skills Section */}
          <SkillsSection skills={skills} className="animate-scale-in" />
          
          {/* Achievements Preview */}
          <AchievementsSection achievements={achievements} className="animate-scale-in" />
        </div>
      </div>
      
      {/* Navigation */}
      <NavBar />
    </div>
  );
};

export default Index;
