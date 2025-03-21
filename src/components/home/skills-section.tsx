
import React from 'react';
import GlassCard from '../ui/glass-card';
import { Database, Dumbbell, BookOpen, Brain, Clock } from 'lucide-react';
import { Skill } from '@/types';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  skills: Skill[];
  className?: string;
}

const SkillsSection = ({ skills, className }: SkillsSectionProps) => {
  // Helper to get the appropriate icon for a skill
  const getSkillIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'activity':
        return <Dumbbell className="h-5 w-5" />;
      case 'book-open':
        return <BookOpen className="h-5 w-5" />;
      case 'brain':
        return <Brain className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <GlassCard className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Skills</h2>
        <span className="text-sm text-solo-secondary">{skills.length} active</span>
      </div>
      
      <div className="space-y-3">
        {skills.map((skill) => {
          const progressPercent = (skill.experience / skill.nextLevelExp) * 100;
          
          return (
            <div key={skill.id} className="bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                    {getSkillIcon(skill.icon)}
                  </div>
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs text-solo-secondary">Level {skill.level}</div>
                  </div>
                </div>
                <div className="bg-solo-highlight/20 text-solo-highlight text-xs py-1 px-2 rounded-full">
                  {skill.experience}/{skill.nextLevelExp} XP
                </div>
              </div>
              
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    progressPercent < 30 ? "bg-red-500" : 
                    progressPercent < 70 ? "bg-yellow-500" : 
                    "bg-gradient-to-r from-solo-accent to-solo-highlight"
                  )}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default SkillsSection;
