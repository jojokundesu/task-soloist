/**
 * Unified API client.
 * - On Android / Capacitor / when the local Express server is down:
 *   uses fully offline in-browser DB (localStorage).
 * - When Express is available (desktop dev): prefers HTTP /api, falls back to local.
 */
import { Capacitor } from '@capacitor/core';
import { localDb, localBeruReply } from './localDb';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function preferLocal(): boolean {
  try {
    if (Capacitor.isNativePlatform()) return true;
  } catch {
    /* ignore */
  }
  // Force offline mode via flag
  if (localStorage.getItem('force_offline') === 'true') return true;
  return false;
}

let serverAvailable: boolean | null = null;

async function probeServer(): Promise<boolean> {
  if (preferLocal()) {
    serverAvailable = false;
    return false;
  }
  if (serverAvailable === true) return true;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 800);
    const res = await fetch(`${API_BASE}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    serverAvailable = res.ok;
  } catch {
    serverAvailable = false;
  }
  return serverAvailable;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function withFallback<T>(serverFn: () => Promise<T>, localFn: () => T | Promise<T>): Promise<T> {
  const ok = await probeServer();
  if (!ok) return localFn();
  try {
    return await serverFn();
  } catch {
    serverAvailable = false;
    return localFn();
  }
}

export const api = {
  health: async () => {
    if (await probeServer()) return request<{ ok: boolean }>('/health');
    return { ok: true, offline: true, mode: 'local' as const };
  },

  getState: () =>
    withFallback(
      () => request<AppState>('/state'),
      () => localDb.getState()
    ),

  getUser: () =>
    withFallback(
      () => request<User>('/user'),
      () => localDb.getState().user
    ),

  updateUser: (data: Partial<User> & Record<string, unknown>) =>
    withFallback(
      () => request<User>('/user', { method: 'PATCH', body: JSON.stringify(data) }),
      () => localDb.updateUser(data)
    ),

  onboarding: (data: OnboardingData) =>
    withFallback(
      () => request<User>('/user/onboarding', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.onboarding(data)
    ),

  getTasks: (params?: Record<string, string>) =>
    withFallback(
      () => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<Task[]>(`/tasks${q}`);
      },
      () => localDb.getState().tasks
    ),

  createTask: (data: Partial<Task>) =>
    withFallback(
      () => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.createTask(data)
    ),

  updateTask: (id: string, data: Partial<Task>) =>
    withFallback(
      () =>
        request<{ task: Task; state: AppState }>(`/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      () => localDb.updateTask(id, data)
    ),

  deleteTask: (id: string) =>
    withFallback(
      () => request<{ ok: boolean }>(`/tasks/${id}`, { method: 'DELETE' }),
      () => {
        localDb.deleteTask(id);
        return { ok: true };
      }
    ),

  getSkills: () =>
    withFallback(
      () => request<Skill[]>('/skills'),
      () => localDb.getState().skills
    ),
  getAchievements: () =>
    withFallback(
      () => request<Achievement[]>('/achievements'),
      () => localDb.getState().achievements
    ),
  getCategories: () =>
    withFallback(
      () => request<Category[]>('/categories'),
      () => localDb.getState().categories
    ),

  getRewards: () =>
    withFallback(
      () => request<Reward[]>('/rewards'),
      () => localDb.getState().rewards
    ),
  createReward: (data: Partial<Reward>) =>
    withFallback(
      () => request<Reward>('/rewards', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.createReward(data)
    ),
  claimReward: (id: string) =>
    withFallback(
      () =>
        request<{ reward: Reward; user: User; state: AppState }>(`/rewards/${id}/claim`, {
          method: 'POST',
        }),
      () => localDb.claimReward(id)
    ),

  getHabits: () =>
    withFallback(
      () => request<Habit[]>('/habits'),
      () => localDb.getState().habits
    ),
  createHabit: (data: Partial<Habit>) =>
    withFallback(
      () => request<Habit>('/habits', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.createHabit(data)
    ),
  toggleHabit: (id: string) =>
    withFallback(
      () =>
        request<{ habit: Habit; state: AppState }>(`/habits/${id}/toggle`, { method: 'POST' }),
      () => localDb.toggleHabit(id)
    ),
  deleteHabit: (id: string) =>
    withFallback(
      () => request<{ ok: boolean }>(`/habits/${id}`, { method: 'DELETE' }),
      () => {
        localDb.deleteHabit(id);
        return { ok: true };
      }
    ),

  getQuests: () =>
    withFallback(
      () => request<Quest[]>('/quests'),
      () => localDb.getState().quests
    ),

  completeMeditation: (data: {
    meditationId: string;
    meditationName: string;
    durationMinutes: number;
    notes?: string;
  }) =>
    withFallback(
      () =>
        request<{ streak: number; unlocked: boolean; user: User; state: AppState }>(
          '/meditations/complete',
          { method: 'POST', body: JSON.stringify(data) }
        ),
      () => localDb.completeMeditation(data)
    ),

  getMeditationSessions: () =>
    withFallback(
      () => request<MeditationSession[]>('/meditations/sessions'),
      () => localDb.getState().meditations
    ),

  getJournal: () =>
    withFallback(
      () => request<JournalEntry[]>('/journal'),
      () => localDb.getState().journal
    ),
  createJournal: (data: Partial<JournalEntry>) =>
    withFallback(
      () => request<JournalEntry>('/journal', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.createJournal(data)
    ),
  updateJournal: (id: string, data: Partial<JournalEntry>) =>
    withFallback(
      () =>
        request<JournalEntry>(`/journal/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
      () => {
        // simple replace
        const state = localDb.getState();
        const entry = state.journal.find((j) => j.id === id);
        if (!entry) throw new Error('Not found');
        Object.assign(entry, data);
        localDb.importData(state as unknown as Record<string, unknown>);
        return entry;
      }
    ),
  deleteJournal: (id: string) =>
    withFallback(
      () => request<{ ok: boolean }>(`/journal/${id}`, { method: 'DELETE' }),
      () => {
        localDb.deleteJournal(id);
        return { ok: true };
      }
    ),

  getInventory: () =>
    withFallback(
      () => request<InventoryItem[]>('/inventory'),
      () => localDb.getState().inventory
    ),
  useItem: (id: string) =>
    withFallback(
      () =>
        request<{ item: InventoryItem | null; user: User; state: AppState }>(
          `/inventory/${id}/use`,
          { method: 'POST' }
        ),
      () => localDb.useItem(id)
    ),

  getActivity: (limit = 50) =>
    withFallback(
      () => request<ActivityItem[]>(`/activity?limit=${limit}`),
      () => localDb.getState().activity.slice(0, limit)
    ),
  getStats: () =>
    withFallback(
      () => request<StatsSummary>('/stats'),
      () => localDb.getState().stats
    ),

  getChat: () =>
    withFallback(
      () => request<Message[]>('/chat'),
      () => localDb.getChat()
    ),

  sendChat: async (content: string) => {
    const ok = await probeServer();
    if (ok) {
      try {
        return await request<{ messages: Message[]; reply: string }>('/chat', {
          method: 'POST',
          body: JSON.stringify({ content }),
        });
      } catch {
        serverAvailable = false;
      }
    }
    const history = localDb.getChat();
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    const state = localDb.getState();
    const reply = localBeruReply(content, state);
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    };
    localDb.saveChat([...history, userMsg, assistantMsg]);
    return { messages: [userMsg, assistantMsg], reply };
  },

  clearChat: () =>
    withFallback(
      () => request<{ ok: boolean }>('/chat', { method: 'DELETE' }),
      () => {
        localDb.clearChat();
        return { ok: true };
      }
    ),

  exportData: () =>
    withFallback(
      () => request<Record<string, unknown>>('/export'),
      () => localDb.exportData()
    ),
  importData: (data: unknown) =>
    withFallback(
      () => request<AppState>('/import', { method: 'POST', body: JSON.stringify(data) }),
      () => localDb.importData(data as Record<string, unknown>)
    ),
  resetData: () =>
    withFallback(
      () => request<AppState>('/reset', { method: 'POST' }),
      () => localDb.resetData()
    ),
};

// ---- shared types ----
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  dueDate?: string;
  recurring?: boolean;
  recurringType?: string;
  xpReward: number;
  currencyReward?: number;
  category?: string;
  skillId?: string;
  priority?: string;
  difficulty?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  icon?: string;
  categoryId?: string;
  description?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  reward: number;
  unlockCondition: string;
  category?: string;
  progress?: number;
  target?: number;
  unlockedAt?: string;
}

export interface User {
  id: string;
  name: string;
  rank: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
  currency: number;
  stats: {
    strength: number;
    intelligence: number;
    charisma: number;
    endurance: number;
    focus: number;
  };
  profile?: {
    age?: number;
    height?: number;
    weight?: number;
    bodyFatPercentage?: number;
    title?: string;
    avatar?: string;
  };
  totals?: {
    totalXpEarned: number;
    tasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate?: string;
  };
  meditation?: {
    streak: number;
    lastMeditated: string;
    completedMeditations: string[];
    unlockedSecretMeditation: boolean;
  };
  skills?: Skill[];
  achievements?: Achievement[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  claimed: boolean;
  icon: string;
  timesClaimed?: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  xpReward: number;
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompleted?: string;
  completedToday: boolean;
  recentLogs: string[];
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  progress: number;
  target: number;
  xpReward: number;
  currencyReward: number;
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  type: string;
  rarity: string;
  icon: string;
  quantity: number;
  effect: Record<string, number>;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  xpGained: number;
  currencyGained: number;
  createdAt: string;
}

export interface MeditationSession {
  id: string;
  meditationId: string;
  meditationName: string;
  durationMinutes: number;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface StatsSummary {
  user: User;
  overview: {
    completed: number;
    pending: number;
    completionRate: number;
    avgSkillLevel: number;
    achievementsUnlocked: number;
    achievementsTotal: number;
    habitCount: number;
    currentStreak: number;
    longestStreak: number;
    totalXp: number;
    currency: number;
  };
  weeklyData: Array<{ name: string; date: string; tasks: number; xp: number; meditations: number }>;
  skillData: Array<{ name: string; value: number; level: number; color: string }>;
  progressData: Array<{ name: string; xp: number; tasks: number }>;
  categoryBreakdown: Array<{
    id: string;
    name: string;
    color: string;
    total: number;
    completed: number;
  }>;
  daily: Array<Record<string, number | string>>;
}

export interface AppState {
  user: User;
  tasks: Task[];
  skills: Skill[];
  achievements: Achievement[];
  categories: Category[];
  rewards: Reward[];
  habits: Habit[];
  quests: Quest[];
  journal: JournalEntry[];
  inventory: InventoryItem[];
  activity: ActivityItem[];
  meditations: MeditationSession[];
  stats: StatsSummary;
}

export interface OnboardingData {
  name: string;
  age: number;
  height: number;
  weight: number;
  bodyFatPercentage: number;
  intelligenceLevel: number;
  strengthLevel: number;
}
