import React from 'react';
import GlassCard from '../ui/glass-card';
import { Brain, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface MeditationSectionProps {
  className?: string;
}

const MeditationSection = ({ className }: MeditationSectionProps) => {
  const { state } = useApp();
  const streak = state?.user?.meditation?.streak || 0;
  const unlocked = !!state?.user?.meditation?.unlockedSecretMeditation;

  return (
    <GlassCard className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-solo-accent mr-2" />
          <h2 className="text-lg font-bold">Meditation Practice</h2>
        </div>
        <span className="text-sm px-2 py-1 bg-solo-accent/20 rounded-full text-solo-accent">
          {streak} day{streak !== 1 ? 's' : ''} streak
        </span>
      </div>

      <div className="p-3 rounded-lg bg-black/20 border border-white/5">
        <div className="text-sm text-solo-secondary mb-2">
          Daily meditation enhances your mental stats and unlocks special abilities.
        </div>

        <div className="text-xs text-solo-accent mt-2 mb-3">
          {unlocked || streak >= 7
            ? "You've unlocked the secret meditation technique! Check the meditation page."
            : `Practice for ${Math.max(0, 7 - streak)} more day${7 - streak !== 1 ? 's' : ''} to unlock the secret technique.`}
        </div>

        <Link
          to="/meditation"
          className="flex items-center justify-center bg-solo-accent/20 hover:bg-solo-accent/30 text-solo-accent py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Start Meditation <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </GlassCard>
  );
};

export default MeditationSection;
