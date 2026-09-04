import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import HeroCard from '@/components/home/hero-card';
import DailyTasks from '@/components/home/daily-tasks';
import SkillsSection from '@/components/home/skills-section';
import AchievementsSection from '@/components/home/achievements-section';
import MeditationSection from '@/components/home/meditation-section';
import GlassCard from '@/components/ui/glass-card';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Flame,
  Gift,
  Package,
  ScrollText,
  Swords,
  Target,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Index = () => {
  const { state, toggleHabit } = useApp();
  const user = state?.user;
  const tasks = state?.tasks || [];
  const skills = state?.skills || [];
  const achievements = state?.achievements || [];
  const habits = state?.habits || [];
  const quests = state?.quests || [];
  const activity = state?.activity || [];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  const pendingToday = tasks.filter((t) => !t.completed).slice(0, 5);
  const activeQuests = quests.filter((q) => q.status === 'active').slice(0, 4);

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="space-y-6">
          <div className="text-center mb-2 mt-2 animate-fade-in">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Task Soloist
            </h1>
            <p className="text-solo-secondary mt-1">Level up through daily achievements</p>
          </div>

          <HeroCard user={user as never} className="animate-scale-in" />

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-2 animate-fade-in">
            {[
              {
                label: 'Streak',
                value: user.totals?.currentStreak ?? 0,
                icon: Flame,
                color: 'text-orange-400',
              },
              {
                label: 'Quests',
                value: user.totals?.tasksCompleted ?? 0,
                icon: CheckCircle2,
                color: 'text-green-400',
              },
              {
                label: 'Coins',
                value: user.currency,
                icon: Gift,
                color: 'text-amber-400',
              },
              {
                label: 'XP',
                value: user.totals?.totalXpEarned ?? 0,
                icon: Target,
                color: 'text-solo-accent',
              },
            ].map((s) => (
              <GlassCard key={s.label} className="p-2 text-center">
                <s.icon className={cn('h-4 w-4 mx-auto mb-1', s.color)} />
                <div className="text-sm font-bold">{s.value}</div>
                <div className="text-[10px] text-solo-secondary">{s.label}</div>
              </GlassCard>
            ))}
          </div>

          {/* System Quests */}
          {activeQuests.length > 0 && (
            <GlassCard className="animate-scale-in">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="h-5 w-5 text-solo-accent" />
                <h2 className="font-semibold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
                  System Quests
                </h2>
              </div>
              <div className="space-y-3">
                {activeQuests.map((q) => (
                  <div key={q.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        {q.title}
                        <span className="ml-2 text-xs text-solo-secondary capitalize">
                          {q.type}
                        </span>
                      </span>
                      <span className="text-solo-secondary">
                        {q.progress}/{q.target}
                      </span>
                    </div>
                    <Progress
                      value={(q.progress / Math.max(q.target, 1)) * 100}
                      className="h-1.5 bg-black/30"
                    />
                    <div className="text-xs text-solo-secondary mt-1">
                      +{q.xpReward} XP · +{q.currencyReward} coins
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Habits snapshot */}
          {habits.length > 0 && (
            <GlassCard className="animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <h2 className="font-semibold">Today's Habits</h2>
                </div>
                <Link to="/habits" className="text-xs text-solo-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {habits.slice(0, 4).map((h) => (
                  <button
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={cn(
                      'text-left p-2 rounded-lg border transition-all text-sm',
                      h.completedToday
                        ? 'border-solo-highlight/40 bg-solo-highlight/10 text-solo-highlight'
                        : 'border-white/10 hover:border-solo-accent/40'
                    )}
                  >
                    <div className="font-medium truncate">{h.name}</div>
                    <div className="text-xs opacity-70">{h.currentStreak}d streak</div>
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          <DailyTasks tasks={pendingToday.length ? pendingToday : tasks} className="animate-scale-in" />

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {[
              { to: '/journal', icon: BookOpen, label: 'Journal', desc: 'Reflect & gain XP' },
              { to: '/inventory', icon: Package, label: 'Inventory', desc: 'Use items' },
              { to: '/rewards', icon: Gift, label: 'Rewards', desc: 'Spend coins' },
              { to: '/chat', icon: ScrollText, label: 'Consult Beru', desc: 'Offline advisor' },
            ].map((link) => (
              <Link key={link.to} to={link.to}>
                <GlassCard className="hover:border-solo-accent/40 transition-all h-full">
                  <link.icon className="h-5 w-5 text-solo-accent mb-2" />
                  <div className="font-medium">{link.label}</div>
                  <div className="text-xs text-solo-secondary">{link.desc}</div>
                </GlassCard>
              </Link>
            ))}
          </div>

          <MeditationSection className="animate-scale-in" />

          <SkillsSection skills={skills as never} className="animate-scale-in" />

          <AchievementsSection
            achievements={achievements.slice(0, 5) as never}
            className="animate-scale-in"
          />

          {/* Recent activity */}
          {activity.length > 0 && (
            <GlassCard className="animate-scale-in">
              <h2 className="font-semibold mb-3">Recent Activity</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activity.slice(0, 8).map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between gap-2 text-sm border-b border-white/5 pb-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{a.title}</div>
                      <div className="text-xs text-solo-secondary">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {(a.xpGained > 0 || a.currencyGained !== 0) && (
                      <div className="text-xs text-solo-accent whitespace-nowrap">
                        {a.xpGained > 0 && `+${a.xpGained} XP`}
                        {a.currencyGained > 0 && ` +${a.currencyGained}¢`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default Index;
