
import React from 'react';
import GlassCard from '../ui/glass-card';
import { Achievement } from '@/types';
import { Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface AchievementsSectionProps {
  achievements: Achievement[];
  className?: string;
}

const AchievementsSection = ({ achievements, className }: AchievementsSectionProps) => {
  // Take only 3 achievements to display
  const displayAchievements = achievements.slice(0, 3);
  const completedCount = achievements.filter(a => a.completed).length;
  
  return (
    <GlassCard className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-solo-accent mr-2" />
          <h2 className="text-lg font-bold">Achievements</h2>
        </div>
        <span className="text-sm text-solo-secondary">
          {completedCount}/{achievements.length} unlocked
        </span>
      </div>
      
      <div className="space-y-3">
        {displayAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={cn(
              "p-3 rounded-lg border flex items-start transition-all duration-300",
              achievement.completed 
                ? "bg-solo-highlight/10 border-solo-highlight/30" 
                : "bg-black/20 border-white/5"
            )}
          >
            <div 
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center mr-3",
                achievement.completed 
                  ? "bg-solo-highlight/20 text-solo-highlight" 
                  : "bg-black/30 text-white/30"
              )}
            >
              <Trophy className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium">{achievement.name}</div>
              <div className="text-xs text-solo-secondary mt-1">
                {achievement.description}
              </div>
              <div className="text-xs text-solo-secondary mt-1">
                {achievement.unlockCondition}
              </div>
            </div>
            
            <div className={cn(
              "text-xs py-1 px-2 rounded-full",
              achievement.completed 
                ? "bg-solo-highlight/20 text-solo-highlight" 
                : "bg-solo-accent/10 text-solo-accent/70"
            )}>
              +{achievement.reward} XP
            </div>
          </div>
        ))}
        
        <Link to="/achievements" className="flex items-center justify-center text-sm text-solo-accent hover:text-solo-highlight transition-colors p-2">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </GlassCard>
  );
};

export default AchievementsSection;
