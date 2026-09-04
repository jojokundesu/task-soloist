import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  api,
  AppState,
  Task,
  User,
  Habit,
  JournalEntry,
  Reward,
  OnboardingData,
  Message,
} from '@/services/api';
import { toast } from 'sonner';

interface AppContextValue {
  state: AppState | null;
  loading: boolean;
  error: string | null;
  online: boolean;
  refresh: () => Promise<void>;
  setState: React.Dispatch<React.SetStateAction<AppState | null>>;
  // helpers
  completeTask: (id: string, completed?: boolean) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  createHabit: (data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  claimReward: (id: string) => Promise<void>;
  createReward: (data: Partial<Reward>) => Promise<void>;
  completeMeditation: (data: {
    meditationId: string;
    meditationName: string;
    durationMinutes: number;
    notes?: string;
  }) => Promise<void>;
  createJournal: (data: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  useItem: (id: string) => Promise<void>;
  updateUser: (data: Partial<User> & Record<string, unknown>) => Promise<void>;
  finishOnboarding: (data: OnboardingData) => Promise<void>;
  exportBackup: () => Promise<void>;
  importBackup: (file: File) => Promise<void>;
  resetAll: () => Promise<void>;
  sendChat: (content: string) => Promise<Message[]>;
  clearChat: () => Promise<void>;
  getChat: () => Promise<Message[]>;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_STATE = (partial?: Partial<AppState>): AppState => ({
  user: {
    id: 'user1',
    name: 'Hunter',
    rank: 'E-Rank Hunter',
    level: 1,
    experience: 0,
    nextLevelExperience: 100,
    currency: 0,
    stats: { strength: 2, intelligence: 3, charisma: 1, endurance: 2, focus: 2 },
    totals: {
      totalXpEarned: 0,
      tasksCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    meditation: {
      streak: 0,
      lastMeditated: '',
      completedMeditations: [],
      unlockedSecretMeditation: false,
    },
  },
  tasks: [],
  skills: [],
  achievements: [],
  categories: [],
  rewards: [],
  habits: [],
  quests: [],
  journal: [],
  inventory: [],
  activity: [],
  meditations: [],
  stats: {
    user: null as unknown as User,
    overview: {
      completed: 0,
      pending: 0,
      completionRate: 0,
      avgSkillLevel: 0,
      achievementsUnlocked: 0,
      achievementsTotal: 0,
      habitCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0,
      currency: 0,
    },
    weeklyData: [],
    skillData: [],
    progressData: [],
    categoryBreakdown: [],
    daily: [],
  },
  ...partial,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getState();
      setState(data);
      setError(null);
      setOnline(true);
    } catch (e) {
      console.error('Failed to load state', e);
      // Ultimate fallback — empty seeded-looking state so UI never bricks on Android
      try {
        const { localDb } = await import('@/services/localDb');
        const data = localDb.getState();
        setState(data);
        setError(null);
        setOnline(true);
      } catch (e2) {
        setError(e instanceof Error ? e.message : 'Failed to load data');
        setOnline(false);
        setState((prev) => prev || EMPTY_STATE());
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    const onOnline = () => {
      setOnline(true);
      refresh();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [refresh]);

  const applyState = (next: AppState) => setState(next);

  const completeTask = async (id: string, completed = true) => {
    try {
      const res = await api.updateTask(id, { completed });
      applyState(res.state);
      if (completed) {
        const task = res.task;
        toast.success('Quest completed!', {
          description: `+${task.xpReward} XP${task.currencyReward ? ` · +${task.currencyReward} coins` : ''}`,
        });
      } else {
        toast.info('Quest marked incomplete');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update task');
    }
  };

  const createTaskFn = async (data: Partial<Task>) => {
    try {
      const task = await api.createTask(data);
      await refresh();
      toast.success('Quest created', { description: task.title });
      return task;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create task');
      return null;
    }
  };

  const updateTaskFn = async (id: string, data: Partial<Task>) => {
    try {
      const res = await api.updateTask(id, data);
      applyState(res.state);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update task');
    }
  };

  const deleteTaskFn = async (id: string) => {
    try {
      await api.deleteTask(id);
      await refresh();
      toast.success('Quest deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete task');
    }
  };

  const toggleHabitFn = async (id: string) => {
    try {
      const res = await api.toggleHabit(id);
      applyState(res.state);
      if (res.habit.completedToday) {
        toast.success(`${res.habit.name}`, {
          description: `Streak: ${res.habit.currentStreak} · +${res.habit.xpReward} XP`,
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to toggle habit');
    }
  };

  const createHabitFn = async (data: Partial<Habit>) => {
    try {
      await api.createHabit(data);
      await refresh();
      toast.success('Habit created');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create habit');
    }
  };

  const deleteHabitFn = async (id: string) => {
    try {
      await api.deleteHabit(id);
      await refresh();
      toast.success('Habit removed');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete habit');
    }
  };

  const claimRewardFn = async (id: string) => {
    try {
      const res = await api.claimReward(id);
      applyState(res.state);
      toast.success('Reward claimed!', { description: res.reward.name });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Not enough currency');
    }
  };

  const createRewardFn = async (data: Partial<Reward>) => {
    try {
      await api.createReward(data);
      await refresh();
      toast.success('Reward added');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create reward');
    }
  };

  const completeMeditationFn = async (data: {
    meditationId: string;
    meditationName: string;
    durationMinutes: number;
    notes?: string;
  }) => {
    try {
      const res = await api.completeMeditation(data);
      applyState(res.state);
      toast.success('Meditation complete', {
        description: `Streak: ${res.streak} day${res.streak === 1 ? '' : 's'}${
          res.unlocked ? ' · Secret technique unlocked!' : ''
        }`,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to log meditation');
    }
  };

  const createJournalFn = async (data: Partial<JournalEntry>) => {
    try {
      await api.createJournal(data);
      await refresh();
      toast.success('Journal entry saved', { description: '+3 XP' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save entry');
    }
  };

  const deleteJournalFn = async (id: string) => {
    try {
      await api.deleteJournal(id);
      await refresh();
      toast.success('Entry deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const useItemFn = async (id: string) => {
    try {
      const res = await api.useItem(id);
      applyState(res.state);
      toast.success('Item consumed');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to use item');
    }
  };

  const updateUserFn = async (data: Partial<User> & Record<string, unknown>) => {
    try {
      const user = await api.updateUser(data);
      setState((prev) => (prev ? { ...prev, user } : prev));
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update profile');
    }
  };

  const finishOnboarding = async (data: OnboardingData) => {
    try {
      const user = await api.onboarding(data);
      setState((prev) => (prev ? { ...prev, user } : EMPTY_STATE({ user })));
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboarding_completed', 'true');
      toast.success('Welcome, Shadow Monarch!', {
        description: 'Your journey begins now.',
      });
    } catch (e) {
      // Still mark onboarding done locally if server hiccups
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboarding_completed', 'true');
      toast.error(e instanceof Error ? e.message : 'Onboarding save failed');
    }
  };

  const exportBackup = async () => {
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task-soloist-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      localStorage.setItem('last_backup_date', new Date().toISOString());
      toast.success('Backup downloaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed');
    }
  };

  const importBackup = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const next = await api.importData(json);
      applyState(next);
      toast.success('Backup restored');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Import failed');
    }
  };

  const resetAll = async () => {
    try {
      const next = await api.resetData();
      applyState(next);
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('onboarding_completed');
      toast.success('Data reset to defaults');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Reset failed');
    }
  };

  const sendChat = async (content: string) => {
    const res = await api.sendChat(content);
    return res.messages;
  };

  const clearChat = async () => {
    await api.clearChat();
  };

  const getChat = async () => api.getChat();

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      loading,
      error,
      online,
      refresh,
      setState,
      completeTask,
      createTask: createTaskFn,
      updateTask: updateTaskFn,
      deleteTask: deleteTaskFn,
      toggleHabit: toggleHabitFn,
      createHabit: createHabitFn,
      deleteHabit: deleteHabitFn,
      claimReward: claimRewardFn,
      createReward: createRewardFn,
      completeMeditation: completeMeditationFn,
      createJournal: createJournalFn,
      deleteJournal: deleteJournalFn,
      useItem: useItemFn,
      updateUser: updateUserFn,
      finishOnboarding,
      exportBackup,
      importBackup,
      resetAll,
      sendChat,
      clearChat,
      getChat,
    }),
    [state, loading, error, online, refresh]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
