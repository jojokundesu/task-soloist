
import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { achievements as allAchievements } from '@/data/mockData';
import GlassCard from '@/components/ui/glass-card';
import { Trophy, Search, X, Medal, Star, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Achievements = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAchievements = allAchievements.filter(achievement => {
    // Filter by status
    if (filter === 'completed' && !achievement.completed) return false;
    if (filter === 'pending' && achievement.completed) return false;
    
    // Filter by search
    if (searchQuery && !achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) && !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const completedCount = allAchievements.filter(a => a.completed).length;
  const totalXpEarned = allAchievements
    .filter(a => a.completed)
    .reduce((sum, a) => sum + a.reward, 0);
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Achievements
          </h1>
          <div className="flex items-center bg-black/20 rounded-lg px-3 py-1">
            <Trophy className="h-4 w-4 text-solo-accent mr-2" />
            <span className="text-sm">
              {completedCount}/{allAchievements.length}
            </span>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in">
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Completed</div>
            <div className="text-xl font-bold flex items-center">
              <Trophy className="h-4 w-4 text-solo-accent mr-2" />
              {completedCount}
            </div>
          </GlassCard>
          
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">XP Earned</div>
            <div className="text-xl font-bold flex items-center">
              <Star className="h-4 w-4 text-solo-accent mr-2" />
              {totalXpEarned}
            </div>
          </GlassCard>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-in">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-solo-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search achievements..."
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-solo-accent/50 focus:border-transparent placeholder-solo-secondary/50 text-solo-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-5 w-5 text-solo-secondary hover:text-solo-text" />
            </button>
          )}
        </div>
        
        {/* Filter Tabs */}
        <div className="flex mb-6 border-b border-white/10 animate-fade-in">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'all' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'pending' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('pending')}
          >
            Locked
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'completed' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('completed')}
          >
            Unlocked
          </button>
        </div>
        
        {/* Achievements List */}
        <div className="space-y-4 animate-scale-in">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement) => (
              <GlassCard 
                key={achievement.id}
                className={cn(
                  "transition-all duration-300",
                  achievement.completed
                    ? "bg-opacity-15 border-solo-highlight/30"
                    : "hover:border-solo-accent/30"
                )}
              >
                <div className="flex items-start">
                  <div 
                    className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center mr-4 shrink-0",
                      achievement.completed 
                        ? "bg-solo-highlight/20 text-solo-highlight" 
                        : "bg-black/30 text-white/30"
                    )}
                  >
                    {achievement.completed ? (
                      <Trophy className="h-6 w-6" />
                    ) : (
                      <Medal className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium text-lg flex items-center",
                      achievement.completed ? "text-solo-highlight" : "text-solo-text"
                    )}>
                      {achievement.name}
                      {achievement.completed && (
                        <ThumbsUp className="h-4 w-4 ml-2 text-solo-highlight" />
                      )}
                    </div>
                    
                    <div className={cn(
                      "text-sm mt-1",
                      achievement.completed ? "text-solo-secondary" : "text-solo-secondary/70"
                    )}>
                      {achievement.description}
                    </div>
                    
                    <div className="flex items-center mt-2 space-x-2">
                      <div className={cn(
                        "text-xs py-1 px-2 rounded-full",
                        achievement.completed 
                          ? "bg-solo-highlight/20 text-solo-highlight" 
                          : "bg-solo-accent/10 text-solo-accent/70"
                      )}>
                        +{achievement.reward} XP
                      </div>
                      
                      <div className="text-xs py-1 px-2 rounded-full bg-black/20 text-solo-secondary">
                        {achievement.unlockCondition}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-solo-secondary mb-2">No achievements found</div>
              <p className="text-sm text-solo-secondary/70">
                {searchQuery 
                  ? "Try adjusting your search parameters" 
                  : "Complete tasks to unlock achievements"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Achievements;
