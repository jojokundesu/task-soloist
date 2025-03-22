
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  recurring?: boolean;
  xpReward: number;
  category?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  icon?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  reward: number;
  unlockCondition: string;
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
