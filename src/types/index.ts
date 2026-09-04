
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
  skills: Skill[];
  achievements: Achievement[];
  meditation?: {
    streak: number;
    lastMeditated: string;
    completedMeditations: string[];
    unlockedSecretMeditation: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface DailyTask {
  id: string;
  taskId: string;
  date: string;
  completed: boolean;
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

export interface Meditation {
  id: string;
  name: string;
  description: string;
  teacher: string;
  instructions: string;
  precautions: string;
  benefits: string;
  icon: string;
  duration: number[];
  isSecret?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
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
