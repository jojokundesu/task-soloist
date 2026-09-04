import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Check, Flame, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Habits = () => {
  const { state, toggleHabit, createHabit, deleteHabit } = useApp();
  const habits = state?.habits || [];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createHabit({ name: name.trim(), description: description.trim(), xpReward: 5 });
    setName('');
    setDescription('');
    setOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Habits
            </h1>
            <p className="text-sm text-solo-secondary mt-1">Forge daily discipline</p>
          </div>
          <Button
            size="sm"
            className="bg-solo-accent hover:bg-solo-accent/80"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-3 animate-scale-in">
          {habits.length === 0 && (
            <GlassCard className="text-center py-10">
              <p className="text-solo-secondary">No habits yet. Create your first ritual.</p>
            </GlassCard>
          )}
          {habits.map((habit) => (
            <GlassCard
              key={habit.id}
              className={cn(
                'transition-all',
                habit.completedToday && 'border-solo-highlight/40 bg-solo-highlight/5'
              )}
            >
              <div className="flex items-start gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'h-10 w-10 rounded-full border shrink-0',
                    habit.completedToday
                      ? 'bg-solo-highlight/20 border-solo-highlight text-solo-highlight'
                      : 'border-white/10 text-white/40 hover:border-solo-accent'
                  )}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {habit.completedToday ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-white/30" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        'font-medium text-lg',
                        habit.completedToday && 'text-solo-highlight'
                      )}
                    >
                      {habit.name}
                    </h3>
                    <button
                      className="text-solo-secondary/50 hover:text-red-400 p-1"
                      onClick={() => deleteHabit(habit.id)}
                      aria-label="Delete habit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-solo-secondary mt-0.5">{habit.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs py-1 px-2 rounded-full bg-orange-500/20 text-orange-300 flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {habit.currentStreak} day streak
                    </span>
                    <span className="text-xs py-1 px-2 rounded-full bg-solo-accent/20 text-solo-accent">
                      +{habit.xpReward} XP
                    </span>
                    <span className="text-xs text-solo-secondary">
                      Best: {habit.longestStreak} · Total: {habit.totalCompletions}
                    </span>
                  </div>
                  {/* mini week dots */}
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      const key = d.toISOString().split('T')[0];
                      const done = habit.recentLogs?.includes(key);
                      return (
                        <div
                          key={key}
                          className={cn(
                            'h-2 flex-1 rounded-full',
                            done ? 'bg-solo-highlight' : 'bg-white/10'
                          )}
                          title={key}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-solo-card border-white/10 text-solo-text">
          <DialogHeader>
            <DialogTitle>New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Habit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/10"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/20 border-white/10"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-solo-accent" onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavBar />
    </div>
  );
};

export default Habits;
