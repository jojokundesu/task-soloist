/**
 * Fully offline in-browser database (localStorage + structured state).
 * Used as the primary data layer on Android / Capacitor — no server required.
 */
import { v4 as uuidv4 } from 'uuid';
import type {
  AppState,
  Task,
  User,
  Skill,
  Achievement,
  Category,
  Reward,
  Habit,
  Quest,
  JournalEntry,
  InventoryItem,
  ActivityItem,
  MeditationSession,
  StatsSummary,
  Message,
  OnboardingData,
} from './api';
import {
  user as defaultUser,
  skills as defaultSkills,
  achievements as defaultAchievements,
  categories as defaultCategories,
  tasks as defaultTasks,
  rewards as defaultRewards,
} from '@/data/mockData';

const KEY = 'task_soloist_v2_state';
const CHAT_KEY = 'task_soloist_v2_chat';
const META_KEY = 'task_soloist_v2_meta';

const RANKS = [
  { min: 1, rank: 'E-Rank Hunter' },
  { min: 5, rank: 'D-Rank Hunter' },
  { min: 10, rank: 'C-Rank Hunter' },
  { min: 20, rank: 'B-Rank Hunter' },
  { min: 35, rank: 'A-Rank Hunter' },
  { min: 50, rank: 'S-Rank Hunter' },
  { min: 75, rank: 'National Level Hunter' },
  { min: 100, rank: 'Shadow Monarch' },
];

function rankForLevel(level: number) {
  let rank = RANKS[0].rank;
  for (const r of RANKS) if (level >= r.min) rank = r.rank;
  return rank;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function now() {
  return new Date().toISOString();
}

function loadRaw(): AppState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppState) : null;
  } catch {
    return null;
  }
}

function save(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
  localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: now() }));
}

function seed(): AppState {
  const ts = now();
  const user: User = {
    ...defaultUser,
    skills: [],
    achievements: [],
    totals: {
      totalXpEarned: 20,
      tasksCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
    },
    meditation: {
      streak: 0,
      lastMeditated: '',
      completedMeditations: [],
      unlockedSecretMeditation: false,
    },
    profile: { title: 'Shadow Monarch', avatar: 'hunter' },
  };

  const skills: Skill[] = [
    ...defaultSkills.map((s) => ({ ...s })),
    {
      id: 'skill6',
      name: 'Creativity',
      level: 1,
      experience: 10,
      nextLevelExp: 100,
      icon: 'palette',
      description: 'Channel creative shadow energy',
    },
    {
      id: 'skill7',
      name: 'Discipline',
      level: 1,
      experience: 20,
      nextLevelExp: 100,
      icon: 'shield',
      description: 'Forge unbreakable will',
    },
  ];

  const achievements: Achievement[] = [
    ...defaultAchievements.map((a) => ({ ...a, completed: false, progress: 0, target: 1 })),
    {
      id: 'ach6',
      name: 'Shadow Apprentice',
      description: 'Reach level 5',
      completed: false,
      icon: 'star',
      reward: 25,
      unlockCondition: 'Reach level 5',
      category: 'level',
      progress: 0,
      target: 5,
    },
    {
      id: 'ach7',
      name: 'Currency Collector',
      description: 'Earn 100 shadow coins',
      completed: false,
      icon: 'coins',
      reward: 30,
      unlockCondition: 'Earn 100 currency',
      category: 'economy',
      progress: 0,
      target: 100,
    },
    {
      id: 'ach8',
      name: 'Meditation Initiate',
      description: 'Complete 5 meditation sessions',
      completed: false,
      icon: 'brain',
      reward: 40,
      unlockCondition: 'Meditate 5 times',
      category: 'meditation',
      progress: 0,
      target: 5,
    },
    {
      id: 'ach9',
      name: 'Quest Conqueror',
      description: 'Complete 50 tasks',
      completed: false,
      icon: 'trophy',
      reward: 80,
      unlockCondition: 'Complete 50 tasks',
      category: 'tasks',
      progress: 0,
      target: 50,
    },
    {
      id: 'ach10',
      name: 'Habit Forge',
      description: 'Maintain a 14-day habit streak',
      completed: false,
      icon: 'flame',
      reward: 60,
      unlockCondition: '14-day habit streak',
      category: 'habits',
      progress: 0,
      target: 14,
    },
    {
      id: 'ach11',
      name: 'Journal Keeper',
      description: 'Write 10 journal entries',
      completed: false,
      icon: 'book-open',
      reward: 35,
      unlockCondition: 'Write 10 journal entries',
      category: 'journal',
      progress: 0,
      target: 10,
    },
    {
      id: 'ach12',
      name: 'Rank Climber',
      description: 'Reach C-Rank Hunter',
      completed: false,
      icon: 'shield',
      reward: 100,
      unlockCondition: 'Reach level 10',
      category: 'level',
      progress: 0,
      target: 10,
    },
    {
      id: 'ach13',
      name: 'Night Owl',
      description: 'Complete a task after 10 PM',
      completed: false,
      icon: 'moon',
      reward: 15,
      unlockCondition: 'Complete a task after 10 PM',
      category: 'tasks',
      progress: 0,
      target: 1,
    },
    {
      id: 'ach14',
      name: 'Perfect Day',
      description: 'Complete all daily tasks in one day',
      completed: false,
      icon: 'check-circle',
      reward: 40,
      unlockCondition: 'Complete all tasks in a day',
      category: 'tasks',
      progress: 0,
      target: 1,
    },
    {
      id: 'ach15',
      name: 'Shadow Sovereign',
      description: 'Reach level 50',
      completed: false,
      icon: 'crown',
      reward: 500,
      unlockCondition: 'Reach level 50',
      category: 'level',
      progress: 0,
      target: 50,
    },
  ];

  const tasks: Task[] = defaultTasks.map((t) => ({
    ...t,
    currencyReward: t.xpReward > 10 ? 2 : 1,
    priority: 'medium',
    difficulty: 'normal',
    skillId:
      t.category === 'cat1'
        ? 'skill1'
        : t.category === 'cat4'
          ? 'skill2'
          : t.category === 'cat2'
            ? 'skill3'
            : undefined,
  }));

  const habits: Habit[] = [
    {
      id: 'habit1',
      name: 'Drink Water',
      description: 'Drink 8 glasses of water',
      icon: 'droplets',
      color: '#0EA5E9',
      xpReward: 5,
      targetDays: 7,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      recentLogs: [],
    },
    {
      id: 'habit2',
      name: 'Morning Stretch',
      description: '5 minutes of stretching',
      icon: 'activity',
      color: '#22C55E',
      xpReward: 5,
      targetDays: 7,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      recentLogs: [],
    },
    {
      id: 'habit3',
      name: 'No Phone Morning',
      description: 'First 30 min without phone',
      icon: 'smartphone',
      color: '#F59E0B',
      xpReward: 8,
      targetDays: 14,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      recentLogs: [],
    },
    {
      id: 'habit4',
      name: 'Gratitude',
      description: "Write 3 things you're grateful for",
      icon: 'heart',
      color: '#EC4899',
      xpReward: 5,
      targetDays: 7,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      recentLogs: [],
    },
  ];

  const quests: Quest[] = [
    {
      id: 'quest1',
      title: 'Daily Dominator',
      description: 'Complete 3 tasks today',
      type: 'daily',
      status: 'active',
      progress: 0,
      target: 3,
      xpReward: 30,
      currencyReward: 5,
    },
    {
      id: 'quest2',
      title: 'Mindful Shadow',
      description: 'Complete a meditation session',
      type: 'daily',
      status: 'active',
      progress: 0,
      target: 1,
      xpReward: 20,
      currencyReward: 3,
    },
    {
      id: 'quest3',
      title: 'Habit Keeper',
      description: 'Complete 2 habits today',
      type: 'daily',
      status: 'active',
      progress: 0,
      target: 2,
      xpReward: 15,
      currencyReward: 2,
    },
    {
      id: 'quest4',
      title: 'Weekly Warrior',
      description: 'Complete 15 tasks this week',
      type: 'weekly',
      status: 'active',
      progress: 0,
      target: 15,
      xpReward: 100,
      currencyReward: 20,
    },
    {
      id: 'quest5',
      title: 'Skill Seeker',
      description: 'Gain XP in any skill',
      type: 'daily',
      status: 'active',
      progress: 0,
      target: 1,
      xpReward: 15,
      currencyReward: 2,
    },
  ];

  const inventory: InventoryItem[] = [
    {
      id: 'item1',
      name: 'Shadow Essence',
      description: 'A faint wisp of shadow energy. Consume to gain +10 XP.',
      type: 'consumable',
      rarity: 'common',
      icon: 'sparkles',
      quantity: 3,
      effect: { xp: 10 },
    },
    {
      id: 'item2',
      name: "Hunter's Token",
      description: 'A token of determination. Consume to gain +5 currency.',
      type: 'consumable',
      rarity: 'uncommon',
      icon: 'coins',
      quantity: 1,
      effect: { currency: 5 },
    },
  ];

  const state: AppState = {
    user,
    tasks,
    skills,
    achievements,
    categories: defaultCategories as Category[],
    rewards: defaultRewards.map((r) => ({ ...r, timesClaimed: 0 })),
    habits,
    quests,
    journal: [],
    inventory,
    activity: [
      {
        id: uuidv4(),
        type: 'system',
        title: 'System Initialized',
        description: 'Your journey as a hunter begins.',
        xpGained: 0,
        currencyGained: 0,
        createdAt: ts,
      },
    ],
    meditations: [],
    stats: emptyStats(user),
  };

  // daily stats bag stored on state via activity + derived
  (state as AppState & { _daily?: Record<string, DailyBag> })._daily = {};
  save(state);
  return recomputeStats(state);
}

interface DailyBag {
  date: string;
  tasks_completed: number;
  tasks_created: number;
  xp_gained: number;
  currency_gained: number;
  meditations: number;
  meditation_minutes: number;
}

function emptyStats(user: User): StatsSummary {
  return {
    user,
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
  };
}

function getDailyBag(state: AppState): Record<string, DailyBag> {
  return (state as AppState & { _daily?: Record<string, DailyBag> })._daily || {};
}

function bumpDaily(state: AppState, field: keyof DailyBag, amount = 1) {
  const bag = getDailyBag(state);
  const d = today();
  if (!bag[d]) {
    bag[d] = {
      date: d,
      tasks_completed: 0,
      tasks_created: 0,
      xp_gained: 0,
      currency_gained: 0,
      meditations: 0,
      meditation_minutes: 0,
    };
  }
  if (field !== 'date') {
    (bag[d] as unknown as Record<string, number>)[field] =
      ((bag[d] as unknown as Record<string, number>)[field] || 0) + amount;
  }
  (state as AppState & { _daily: Record<string, DailyBag> })._daily = bag;
}

function logActivity(
  state: AppState,
  type: string,
  title: string,
  description = '',
  xp = 0,
  currency = 0
) {
  state.activity = [
    {
      id: uuidv4(),
      type,
      title,
      description,
      xpGained: xp,
      currencyGained: currency,
      createdAt: now(),
    },
    ...state.activity,
  ].slice(0, 200);
}

function addExperience(state: AppState, amount: number) {
  if (amount <= 0) return;
  let exp = state.user.experience + amount;
  let level = state.user.level;
  let next = state.user.nextLevelExperience;
  let gained = 0;
  while (exp >= next) {
    exp -= next;
    level += 1;
    gained += 1;
    next = Math.floor(next * 1.45);
  }
  state.user.experience = exp;
  state.user.level = level;
  state.user.nextLevelExperience = next;
  state.user.rank = rankForLevel(level);
  state.user.totals = state.user.totals || {
    totalXpEarned: 0,
    tasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
  state.user.totals.totalXpEarned += amount;
  if (gained > 0) {
    state.user.stats.strength += gained % 2 === 0 ? 1 : 0;
    state.user.stats.intelligence += gained % 3 === 0 ? 1 : 0;
    state.user.stats.endurance += gained % 2 === 1 ? 1 : 0;
    state.user.stats.focus += gained % 4 === 0 ? 1 : 0;
    state.user.stats.charisma += gained % 5 === 0 ? 1 : 0;
  }
  checkLevelAchievements(state, level);
  bumpDaily(state, 'xp_gained', amount);
}

function addCurrency(state: AppState, amount: number) {
  state.user.currency = Math.max(0, state.user.currency + amount);
  if (amount > 0) {
    bumpDaily(state, 'currency_gained', amount);
    checkAchievementProgress(state, 'ach7', state.user.currency);
  }
}

function addSkillXp(state: AppState, skillId: string | undefined, amount: number) {
  if (!skillId || amount <= 0) return;
  const skill = state.skills.find((s) => s.id === skillId);
  if (!skill) return;
  skill.experience += amount;
  while (skill.experience >= skill.nextLevelExp) {
    skill.experience -= skill.nextLevelExp;
    skill.level += 1;
    skill.nextLevelExp = Math.floor(skill.nextLevelExp * 1.4);
    addExperience(state, 5);
    logActivity(state, 'skill_level', `${skill.name} leveled up!`, `Reached level ${skill.level}`, 5, 0);
  }
  bumpQuest(state, 'skill');
}

function unlockAchievement(state: AppState, id: string) {
  const ach = state.achievements.find((a) => a.id === id);
  if (!ach || ach.completed) return;
  ach.completed = true;
  ach.progress = ach.target || 1;
  ach.unlockedAt = now();
  addExperience(state, ach.reward);
  addCurrency(state, Math.ceil(ach.reward / 5));
  logActivity(state, 'achievement', `Achievement unlocked: ${ach.name}`, ach.description, ach.reward, Math.ceil(ach.reward / 5));
  if (Math.random() < 0.4) grantRandomItem(state);
}

function checkAchievementProgress(state: AppState, id: string, progress: number) {
  const ach = state.achievements.find((a) => a.id === id);
  if (!ach || ach.completed) return;
  ach.progress = Math.min(progress, ach.target || 1);
  if (ach.progress >= (ach.target || 1)) unlockAchievement(state, id);
}

function checkLevelAchievements(state: AppState, level: number) {
  if (level >= 5) unlockAchievement(state, 'ach6');
  if (level >= 10) unlockAchievement(state, 'ach12');
  if (level >= 50) unlockAchievement(state, 'ach15');
}

function grantRandomItem(state: AppState) {
  const drops = [
    { name: 'Shadow Essence', description: 'Gain +10 XP when consumed.', type: 'consumable', rarity: 'common', icon: 'sparkles', effect: { xp: 10 } },
    { name: "Hunter's Token", description: 'Gain +5 currency when consumed.', type: 'consumable', rarity: 'uncommon', icon: 'coins', effect: { currency: 5 } },
    { name: 'Focus Potion', description: 'Gain +15 XP and +1 focus.', type: 'consumable', rarity: 'rare', icon: 'flask', effect: { xp: 15, focus: 1 } },
  ];
  const drop = drops[Math.floor(Math.random() * drops.length)];
  const existing = state.inventory.find((i) => i.name === drop.name);
  if (existing) existing.quantity += 1;
  else
    state.inventory.push({
      id: uuidv4(),
      name: drop.name,
      description: drop.description,
      type: drop.type,
      rarity: drop.rarity,
      icon: drop.icon,
      quantity: 1,
      effect: drop.effect,
    });
  logActivity(state, 'item', `Obtained ${drop.name}`, drop.description);
}

function bumpQuest(state: AppState, kind: 'tasks' | 'habits' | 'meditation' | 'skill') {
  for (const q of state.quests) {
    if (q.status !== 'active') continue;
    const t = (q.title + (q.description || '')).toLowerCase();
    let match = false;
    if (kind === 'tasks' && (t.includes('task') || t.includes('quest') || t.includes('dominator') || t.includes('warrior') || q.type === 'weekly'))
      match = true;
    if (kind === 'habits' && t.includes('habit')) match = true;
    if (kind === 'meditation' && (t.includes('meditat') || t.includes('mindful'))) match = true;
    if (kind === 'skill' && t.includes('skill')) match = true;
    if (!match) continue;
    q.progress = Math.min(q.progress + 1, q.target);
    if (q.progress >= q.target) {
      q.status = 'completed';
      addExperience(state, q.xpReward);
      addCurrency(state, q.currencyReward);
      logActivity(state, 'quest', `Quest complete: ${q.title}`, q.description, q.xpReward, q.currencyReward);
    }
  }
}

function updateStreak(state: AppState) {
  const t = today();
  const totals = state.user.totals!;
  if (totals.lastActiveDate === t) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.toISOString().split('T')[0];
  if (totals.lastActiveDate === y) totals.currentStreak += 1;
  else totals.currentStreak = 1;
  totals.longestStreak = Math.max(totals.longestStreak, totals.currentStreak);
  totals.lastActiveDate = t;
  checkAchievementProgress(state, 'ach3', totals.currentStreak);
}

function recomputeStats(state: AppState): AppState {
  const completed = state.tasks.filter((t) => t.completed).length;
  const pending = state.tasks.length - completed;
  const avgSkill =
    state.skills.length > 0
      ? Math.round((state.skills.reduce((s, sk) => s + sk.level, 0) / state.skills.length) * 10) / 10
      : 0;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMap: Record<string, { name: string; date: string; tasks: number; xp: number; meditations: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    weeklyMap[key] = { name: days[d.getDay()], date: key, tasks: 0, xp: 0, meditations: 0 };
  }
  const bag = getDailyBag(state);
  for (const [date, row] of Object.entries(bag)) {
    if (weeklyMap[date]) {
      weeklyMap[date].tasks = row.tasks_completed;
      weeklyMap[date].xp = row.xp_gained;
      weeklyMap[date].meditations = row.meditations;
    }
  }

  const colors = ['#8B5CF6', '#6E59A5', '#D946EF', '#0EA5E9', '#F97316', '#22C55E', '#EAB308'];
  state.stats = {
    user: state.user,
    overview: {
      completed,
      pending,
      completionRate: state.tasks.length ? Math.round((completed / state.tasks.length) * 100) : 0,
      avgSkillLevel: avgSkill,
      achievementsUnlocked: state.achievements.filter((a) => a.completed).length,
      achievementsTotal: state.achievements.length,
      habitCount: state.habits.length,
      currentStreak: state.user.totals?.currentStreak || 0,
      longestStreak: state.user.totals?.longestStreak || 0,
      totalXp: state.user.totals?.totalXpEarned || 0,
      currency: state.user.currency,
    },
    weeklyData: Object.values(weeklyMap),
    skillData: state.skills.map((skill, i) => ({
      name: skill.name,
      value: skill.level * 10 + skill.experience / 2,
      level: skill.level,
      color: colors[i % colors.length],
    })),
    progressData: Object.values(bag)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((d) => ({ name: d.date.slice(5), xp: d.xp_gained, tasks: d.tasks_completed })),
    categoryBreakdown: state.categories.map((cat) => {
      const catTasks = state.tasks.filter((t) => t.category === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        total: catTasks.length,
        completed: catTasks.filter((t) => t.completed).length,
      };
    }),
    daily: Object.values(bag),
  };
  return state;
}

function ensure(): AppState {
  let state = loadRaw();
  if (!state || !state.user) state = seed();
  // reset daily quests if all daily completed
  const activeDaily = state.quests.filter((q) => q.type === 'daily' && q.status === 'active').length;
  if (activeDaily === 0) {
    state.quests = state.quests.map((q) =>
      q.type === 'daily' ? { ...q, status: 'active', progress: 0 } : q
    );
  }
  // refresh habit completedToday
  const t = today();
  state.habits = state.habits.map((h) => ({
    ...h,
    completedToday: (h.recentLogs || []).includes(t),
  }));
  return recomputeStats(state);
}

function persist(state: AppState) {
  save(recomputeStats(state));
  return loadRaw()!;
}

// ---------- Public API mirroring server ----------

export const localDb = {
  getState(): AppState {
    return ensure();
  },

  onboarding(data: OnboardingData): User {
    const state = ensure();
    state.user.name = data.name || 'Shadow Monarch';
    state.user.stats.strength = Math.max(5, Math.min(15, (data.strengthLevel || 5) + 5));
    state.user.stats.intelligence = Math.max(5, Math.min(15, (data.intelligenceLevel || 5) + 5));
    state.user.stats.endurance = data.bodyFatPercentage > 25 ? 8 : 10;
    state.user.profile = {
      ...(state.user.profile || {}),
      age: data.age,
      height: data.height,
      weight: data.weight,
      bodyFatPercentage: data.bodyFatPercentage,
    };
    persist(state);
    return state.user;
  },

  updateUser(data: Partial<User> & Record<string, unknown>): User {
    const state = ensure();
    if (data.name) state.user.name = data.name as string;
    if (data.stats) state.user.stats = { ...state.user.stats, ...(data.stats as User['stats']) };
    Object.assign(state.user, data);
    persist(state);
    return state.user;
  },

  createTask(data: Partial<Task>): Task {
    const state = ensure();
    const task: Task = {
      id: data.id || uuidv4(),
      title: data.title || 'New Quest',
      description: data.description || '',
      completed: false,
      date: data.date || now(),
      dueDate: data.dueDate,
      recurring: !!data.recurring,
      recurringType: data.recurringType,
      xpReward: data.xpReward ?? 10,
      currencyReward: data.currencyReward ?? 1,
      category: data.category,
      skillId: data.skillId,
      priority: data.priority || 'medium',
      difficulty: data.difficulty || 'normal',
      notes: data.notes || '',
      createdAt: now(),
      updatedAt: now(),
    };
    state.tasks = [task, ...state.tasks];
    bumpDaily(state, 'tasks_created', 1);
    logActivity(state, 'task_created', `Quest created: ${task.title}`);
    persist(state);
    return task;
  },

  updateTask(id: string, updates: Partial<Task>): { task: Task; state: AppState } {
    const state = ensure();
    const idx = state.tasks.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error('Task not found');
    const existing = state.tasks[idx];
    const wasCompleted = existing.completed;
    const task = { ...existing, ...updates, updatedAt: now() };
    state.tasks[idx] = task;

    if (updates.completed === true && !wasCompleted) {
      task.completedAt = now();
      const xp = task.xpReward || 10;
      const currency = task.currencyReward || 1;
      addExperience(state, xp);
      addCurrency(state, currency);
      bumpDaily(state, 'tasks_completed', 1);
      if (task.skillId) addSkillXp(state, task.skillId, Math.ceil(xp / 2));
      state.user.totals!.tasksCompleted += 1;
      updateStreak(state);
      checkAchievementProgress(state, 'ach1', 1);
      checkAchievementProgress(state, 'ach9', state.user.totals!.tasksCompleted);
      const hour = new Date().getHours();
      if (hour < 8) unlockAchievement(state, 'ach2');
      if (hour >= 22) unlockAchievement(state, 'ach13');
      if (task.category === 'cat1') {
        const c = state.tasks.filter((t) => t.category === 'cat1' && t.completed).length;
        checkAchievementProgress(state, 'ach5', c);
      }
      if (task.category === 'cat4') {
        const c = state.tasks.filter((t) => t.category === 'cat4' && t.completed).length;
        checkAchievementProgress(state, 'ach4', c);
      }
      bumpQuest(state, 'tasks');
      if (state.tasks.filter((t) => !t.completed && t.recurring).length === 0) {
        unlockAchievement(state, 'ach14');
      }
      logActivity(state, 'task_completed', `Quest completed: ${task.title}`, `+${xp} XP`, xp, currency);
      if (Math.random() < 0.15) grantRandomItem(state);
    }
    const next = persist(state);
    return { task: next.tasks.find((t) => t.id === id)!, state: next };
  },

  deleteTask(id: string) {
    const state = ensure();
    state.tasks = state.tasks.filter((t) => t.id !== id);
    persist(state);
  },

  createHabit(data: Partial<Habit>): Habit {
    const state = ensure();
    const habit: Habit = {
      id: uuidv4(),
      name: data.name || 'New Habit',
      description: data.description || '',
      icon: data.icon || 'flame',
      color: data.color || '#8B5CF6',
      xpReward: data.xpReward || 5,
      targetDays: data.targetDays || 7,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completedToday: false,
      recentLogs: [],
    };
    state.habits = [...state.habits, habit];
    persist(state);
    return habit;
  },

  toggleHabit(id: string): { habit: Habit; state: AppState } {
    const state = ensure();
    const habit = state.habits.find((h) => h.id === id);
    if (!habit) throw new Error('Habit not found');
    const t = today();
    const logs = habit.recentLogs || [];
    if (logs.includes(t)) {
      habit.recentLogs = logs.filter((d) => d !== t);
      habit.completedToday = false;
      habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
    } else {
      habit.recentLogs = [t, ...logs].slice(0, 60);
      habit.completedToday = true;
      habit.totalCompletions += 1;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.toISOString().split('T')[0];
      if (habit.lastCompleted === y || habit.lastCompleted === t) {
        if (habit.lastCompleted !== t) habit.currentStreak += 1;
      } else habit.currentStreak = 1;
      habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
      habit.lastCompleted = t;
      addExperience(state, habit.xpReward);
      bumpQuest(state, 'habits');
      checkAchievementProgress(state, 'ach10', habit.currentStreak);
      logActivity(state, 'habit', `Habit completed: ${habit.name}`, `Streak: ${habit.currentStreak}`, habit.xpReward, 0);
    }
    const next = persist(state);
    return { habit: next.habits.find((h) => h.id === id)!, state: next };
  },

  deleteHabit(id: string) {
    const state = ensure();
    state.habits = state.habits.filter((h) => h.id !== id);
    persist(state);
  },

  claimReward(id: string): { reward: Reward; user: User; state: AppState } {
    const state = ensure();
    const reward = state.rewards.find((r) => r.id === id);
    if (!reward) throw new Error('Reward not found');
    if (state.user.currency < reward.cost) throw new Error('Not enough currency');
    addCurrency(state, -reward.cost);
    reward.timesClaimed = (reward.timesClaimed || 0) + 1;
    logActivity(state, 'reward', `Claimed reward: ${reward.name}`, reward.description, 0, -reward.cost);
    const next = persist(state);
    return { reward: next.rewards.find((r) => r.id === id)!, user: next.user, state: next };
  },

  createReward(data: Partial<Reward>): Reward {
    const state = ensure();
    const reward: Reward = {
      id: uuidv4(),
      name: data.name || 'Reward',
      description: data.description || '',
      cost: data.cost || 10,
      claimed: false,
      icon: data.icon || 'gift',
      timesClaimed: 0,
    };
    state.rewards = [...state.rewards, reward];
    persist(state);
    return reward;
  },

  completeMeditation(data: {
    meditationId: string;
    meditationName: string;
    durationMinutes: number;
    notes?: string;
  }): { streak: number; unlocked: boolean; user: User; state: AppState } {
    const state = ensure();
    const session: MeditationSession = {
      id: uuidv4(),
      meditationId: data.meditationId,
      meditationName: data.meditationName,
      durationMinutes: data.durationMinutes,
      createdAt: now(),
    };
    state.meditations = [session, ...state.meditations];
    const med = state.user.meditation || {
      streak: 0,
      lastMeditated: '',
      completedMeditations: [],
      unlockedSecretMeditation: false,
    };
    const t = today();
    if (med.lastMeditated !== t) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.toISOString().split('T')[0];
      med.streak = med.lastMeditated === y ? med.streak + 1 : 1;
      med.lastMeditated = t;
      if (!med.completedMeditations.includes(t)) med.completedMeditations.push(t);
    }
    if (med.streak >= 7) med.unlockedSecretMeditation = true;
    state.user.meditation = med;
    const xp = Math.max(5, data.durationMinutes);
    addExperience(state, xp);
    addSkillXp(state, 'skill3', Math.ceil(data.durationMinutes / 2));
    bumpDaily(state, 'meditations', 1);
    bumpDaily(state, 'meditation_minutes', data.durationMinutes);
    bumpQuest(state, 'meditation');
    checkAchievementProgress(state, 'ach8', state.meditations.length);
    logActivity(state, 'meditation', `Meditated: ${data.meditationName}`, `${data.durationMinutes} min`, xp, 0);
    const next = persist(state);
    return {
      streak: next.user.meditation!.streak,
      unlocked: next.user.meditation!.unlockedSecretMeditation,
      user: next.user,
      state: next,
    };
  },

  createJournal(data: Partial<JournalEntry>): JournalEntry {
    const state = ensure();
    const entry: JournalEntry = {
      id: uuidv4(),
      title: data.title || '',
      content: data.content || '',
      mood: data.mood ?? 3,
      tags: data.tags || [],
      createdAt: now(),
      updatedAt: now(),
    };
    state.journal = [entry, ...state.journal];
    checkAchievementProgress(state, 'ach11', state.journal.length);
    addExperience(state, 3);
    logActivity(state, 'journal', entry.title || 'Journal entry', entry.content.slice(0, 80), 3, 0);
    persist(state);
    return entry;
  },

  deleteJournal(id: string) {
    const state = ensure();
    state.journal = state.journal.filter((j) => j.id !== id);
    persist(state);
  },

  useItem(id: string): { item: InventoryItem | null; user: User; state: AppState } {
    const state = ensure();
    const item = state.inventory.find((i) => i.id === id);
    if (!item || item.quantity < 1) throw new Error('Item not available');
    const effect = item.effect || {};
    if (effect.xp) addExperience(state, effect.xp);
    if (effect.currency) addCurrency(state, effect.currency);
    for (const stat of ['focus', 'endurance', 'strength', 'intelligence', 'charisma'] as const) {
      if (effect[stat]) state.user.stats[stat] += effect[stat];
    }
    item.quantity -= 1;
    if (item.quantity <= 0) state.inventory = state.inventory.filter((i) => i.id !== id);
    logActivity(state, 'item_used', `Used ${item.name}`, item.description, effect.xp || 0, effect.currency || 0);
    const next = persist(state);
    return {
      item: next.inventory.find((i) => i.id === id) || null,
      user: next.user,
      state: next,
    };
  },

  exportData(): Record<string, unknown> {
    const state = ensure();
    return { version: 2, exportedAt: now(), ...state, _daily: getDailyBag(state) };
  },

  importData(payload: Record<string, unknown>): AppState {
    const state = { ...(payload as unknown as AppState) };
    if (!state.user) throw new Error('Invalid backup');
    save(state);
    return ensure();
  },

  resetData(): AppState {
    localStorage.removeItem(KEY);
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(META_KEY);
    return seed();
  },

  getChat(): Message[] {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    const welcome: Message = {
      id: 'welcome',
      role: 'assistant',
      content:
        'Greetings, my Liege! I am Beru, your loyal servant. I run entirely offline on this device. Ask about your status, quests, meditation, habits, or how to grow stronger!',
      timestamp: now(),
    };
    localStorage.setItem(CHAT_KEY, JSON.stringify([welcome]));
    return [welcome];
  },

  saveChat(messages: Message[]) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-100)));
  },

  clearChat() {
    localStorage.removeItem(CHAT_KEY);
  },
};

// Offline Beru (same spirit as server engine)
export function localBeruReply(input: string, state: AppState): string {
  const u = state.user;
  const ctx = {
    name: u.name || 'Shadow Monarch',
    rank: u.rank,
    level: u.level,
    experience: u.experience,
    nextLevel: u.nextLevelExperience,
    currency: u.currency,
    tasksCompleted: u.totals?.tasksCompleted || 0,
    streak: u.totals?.currentStreak || 0,
    medStreak: u.meditation?.streak || 0,
    pending: state.tasks.filter((t) => !t.completed).length,
    habits: state.habits.length,
    achDone: state.achievements.filter((a) => a.completed).length,
    achTotal: state.achievements.length,
  };
  const lower = (input || '').toLowerCase();
  const rules: Array<[string[], string]> = [
    [['hello', 'hi', 'hey', 'greetings'], `Greetings, ${ctx.name}! I, Beru, stand ready. You are ${ctx.rank} at level ${ctx.level}. How may I serve?`],
    [['status', 'progress', 'stats', 'level', 'rank', 'how strong', 'how am i'], `My Liege: ${ctx.rank}, Level ${ctx.level}, XP ${ctx.experience}/${ctx.nextLevel}, coins ${ctx.currency}, quests conquered ${ctx.tasksCompleted}, streak ${ctx.streak} days, meditation streak ${ctx.medStreak}.`],
    [['task', 'quest', 'todo', 'what should'], ctx.pending === 0 ? `All quests vanquished! Create new challenges, my Liege.` : `You have ${ctx.pending} quests pending. Strike the high-priority ones first!`],
    [['motivat', 'tired', 'lazy', 'encourage', 'hard'], `The Shadow Monarch does not yield! You are Level ${ctx.level} with a ${ctx.streak}-day streak. One small quest now compounds into dominion later.`],
    [['meditat', 'calm', 'focus', 'stress'], `Meditation chamber awaits. Streak: ${ctx.medStreak}. Even 5 minutes strengthens the vessel.`],
    [['habit', 'routine', 'streak'], `You keep ${ctx.habits} habits. Mark them daily — a 14-day streak forges the Habit Forge achievement.`],
    [['workout', 'exercise', 'fitness', 'gym'], `Train with compound movements 3–5 days weekly. Log each session as a Physical quest for XP and skill growth!`],
    [['food', 'diet', 'eat', 'nutrition', 'water'], `Fuel the vessel: protein, complex carbs, water. Log “Drink Water” as a daily habit.`],
    [['reward', 'coin', 'currency', 'spend'], `You hold ${ctx.currency} shadow coins. Claim rewards from the Rewards hall to reinforce effort with pleasure.`],
    [['achievement', 'trophy'], `Achievements: ${ctx.achDone}/${ctx.achTotal} unlocked. Each grants XP and occasional loot.`],
    [['journal', 'write', 'diary', 'mood'], `The Journal grants +3 XP per entry. Ten entries unlock Journal Keeper.`],
    [['inventory', 'item', 'loot', 'potion'], `Use consumables from Inventory — Shadow Essence, Tokens, Focus Potions — earned from conquests.`],
    [['solo', 'jinwoo', 'jin-woo', 'beru', 'shadow monarch', 'ashborn'], `I was King of the Ants on Jeju before you raised me. Ashborn, then Sung Jin-Woo, now you — I serve eternally!`],
    [['app', 'help', 'how to', 'feature', 'guide'], `Task Soloist runs fully offline on your device. Halls: Home, Quests, Habits, Calendar, Stats, Achievements, Meditation, Journal, Inventory, Rewards, and this chamber.`],
    [['thank', 'thanks'], `Your gratitude honors me, my Liege!`],
    [['bye', 'goodbye', 'farewell'], `Until next command, Shadow Monarch. Beru stands ready.`],
  ];
  for (const [kws, reply] of rules) {
    if (kws.some((k) => lower.includes(k))) return reply;
  }
  return `I hear you, ${ctx.name}. Ask about status, quests, meditation, habits, fitness, or how to use this System. Your Level ${ctx.level} path is clear!`;
}
