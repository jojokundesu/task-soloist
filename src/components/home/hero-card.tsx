
import React from 'react';
import GlassCard from '../ui/glass-card';
import ProgressRing from '../ui/progress-ring';
import { ArrowUpRight, Gauge, Swords } from 'lucide-react';
import { User } from '@/types';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface HeroCardProps {
  user: User;
  className?: string;
}

const HeroCard = ({ user, className }: HeroCardProps) => {
  const experiencePercentage = (user.experience / user.nextLevelExperience) * 100;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate('/stats');
  };

  return (
    <GlassCard className={cn("p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-solo-accent mb-1 uppercase tracking-wider flex items-center">
            <Swords className="h-3 w-3 mr-1" /> Hunter Status
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="flex items-center">
            <span className="text-xs text-solo-secondary">{user.rank}</span>
            <span className="px-2 py-0.5 rounded-full bg-solo-accent/20 text-solo-accent text-xs ml-2">
              Level {user.level}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs font-semibold text-solo-accent uppercase tracking-wider mb-1">Currency</div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mr-2"></div>
            <span className="text-xl font-bold">{user.currency}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(user.stats).map(([stat, value]) => (
              <div key={stat} className="bg-black/20 rounded-lg p-2 text-center">
                <div className="text-xs text-solo-secondary capitalize">{stat}</div>
                <div className="text-lg font-bold">{value}</div>
              </div>
            ))}
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-solo-secondary">Next Level</span>
              <span className="text-xs text-solo-accent">{user.experience}/{user.nextLevelExperience} XP</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-solo-accent to-solo-highlight h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${experiencePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex flex-col items-center">
          <ProgressRing 
            progress={experiencePercentage} 
            size={90} 
            background="rgba(0,0,0,0.3)"
            foreground="rgb(139, 92, 246)"
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs text-solo-secondary">LEVEL</span>
              <span className="text-2xl font-bold">{user.level}</span>
            </div>
          </ProgressRing>
          <button 
            className="mt-2 text-xs flex items-center text-solo-accent hover:text-solo-highlight transition-colors"
            onClick={handleDetailsClick}
          >
            <span>Details</span>
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default HeroCard;
