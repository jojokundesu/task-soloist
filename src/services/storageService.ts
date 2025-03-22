import { Task, User, Skill, Achievement, Category, Reward, DailyTask, Meditation } from "@/types";

// Keys for storage
const STORAGE_KEYS = {
  TASKS: 'tasks_soloist_tasks',
  USER: 'tasks_soloist_user',
  SKILLS: 'tasks_soloist_skills',
  ACHIEVEMENTS: 'tasks_soloist_achievements',
  CATEGORIES: 'tasks_soloist_categories',
  REWARDS: 'tasks_soloist_rewards',
  DAILY_TASKS: 'tasks_soloist_daily_tasks',
  INITIALIZED: 'app_initialized',
  MEDITATIONS: 'tasks_soloist_meditations',
  MEDITATION_LOGS: 'tasks_soloist_meditation_logs',
};

// Generic get function
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return defaultValue;
  }
};

// Generic set function
const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Check if the app data is initialized
export const checkStorageInitialized = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
};

// Tasks
export const getTasks = (): Task[] => getItem<Task[]>(STORAGE_KEYS.TASKS, []);
export const setTasks = (tasks: Task[]): void => setItem(STORAGE_KEYS.TASKS, tasks);
export const addTask = (task: Task): void => {
  const tasks = getTasks();
  setTasks([...tasks, task]);
};
export const updateTask = (taskId: string, updates: Partial<Task>): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, ...updates } : task
  );
  setTasks(updatedTasks);
};
export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  setTasks(tasks.filter(task => task.id !== taskId));
};

// User
export const getUser = (): User | null => getItem<User | null>(STORAGE_KEYS.USER, null);
export const setUser = (user: User): void => setItem(STORAGE_KEYS.USER, user);
export const updateUser = (updates: Partial<User>): void => {
  const user = getUser();
  if (user) {
    setUser({ ...user, ...updates });
  }
};
export const addExperience = (amount: number): void => {
  const user = getUser();
  if (user) {
    let newExperience = user.experience + amount;
    let level = user.level;
    let nextLevelExperience = user.nextLevelExperience;
    
    // Level up logic
    while (newExperience >= nextLevelExperience) {
      level++;
      newExperience -= nextLevelExperience;
      nextLevelExperience = Math.floor(nextLevelExperience * 1.5);
    }
    
    setUser({
      ...user,
      level,
      experience: newExperience,
      nextLevelExperience
    });
  }
};

// Meditation functions
export const getMeditationStreak = (): number => {
  const user = getUser();
  return user?.meditation?.streak || 0;
};

export const updateMeditationStreak = (): void => {
  const user = getUser();
  if (user) {
    const today = new Date().toISOString().split('T')[0];
    let streak = user.meditation?.streak || 0;
    let lastMeditated = user.meditation?.lastMeditated || '';
    let completedMeditations = user.meditation?.completedMeditations || [];
    let unlockedSecretMeditation = user.meditation?.unlockedSecretMeditation || false;
    
    // If this is the first meditation or it's a different day than last meditation
    if (!lastMeditated || lastMeditated !== today) {
      // Check if the last meditation was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastMeditated === yesterdayStr) {
        // Consecutive day, increase streak
        streak += 1;
      } else if (lastMeditated !== today) {
        // Not consecutive, reset streak
        streak = 1;
      }
      
      // Update last meditated date
      lastMeditated = today;
      
      // Add to completed meditations if not already there
      if (!completedMeditations.includes(today)) {
        completedMeditations.push(today);
      }
      
      // Check if streak has reached 7 days
      if (streak >= 7 && !unlockedSecretMeditation) {
        unlockedSecretMeditation = true;
        // Could also trigger an achievement here
      }
      
      // Update user
      setUser({
        ...user,
        meditation: {
          streak,
          lastMeditated,
          completedMeditations,
          unlockedSecretMeditation
        }
      });
    }
  }
};

export const checkSecretMeditationUnlocked = (): boolean => {
  const user = getUser();
  return user?.meditation?.unlockedSecretMeditation || false;
};

// Skills
export const getSkills = (): Skill[] => getItem<Skill[]>(STORAGE_KEYS.SKILLS, []);
export const setSkills = (skills: Skill[]): void => setItem(STORAGE_KEYS.SKILLS, skills);
export const updateSkill = (skillId: string, updates: Partial<Skill>): void => {
  const skills = getSkills();
  const updatedSkills = skills.map(skill => 
    skill.id === skillId ? { ...skill, ...updates } : skill
  );
  setSkills(updatedSkills);
};

// Achievements
export const getAchievements = (): Achievement[] => getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
export const setAchievements = (achievements: Achievement[]): void => setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
export const completeAchievement = (achievementId: string): void => {
  const achievements = getAchievements();
  const updatedAchievements = achievements.map(achievement => 
    achievement.id === achievementId ? { ...achievement, completed: true } : achievement
  );
  setAchievements(updatedAchievements);
};

// Categories
export const getCategories = (): Category[] => getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
export const setCategories = (categories: Category[]): void => setItem(STORAGE_KEYS.CATEGORIES, categories);

// Rewards
export const getRewards = (): Reward[] => getItem<Reward[]>(STORAGE_KEYS.REWARDS, []);
export const setRewards = (rewards: Reward[]): void => setItem(STORAGE_KEYS.REWARDS, rewards);
export const updateReward = (rewardId: string, updates: Partial<Reward>): void => {
  const rewards = getRewards();
  const updatedRewards = rewards.map(reward => 
    reward.id === rewardId ? { ...reward, ...updates } : reward
  );
  setRewards(updatedRewards);
};

// Daily Tasks
export const getDailyTasks = (): DailyTask[] => getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS, []);
export const setDailyTasks = (dailyTasks: DailyTask[]): void => setItem(STORAGE_KEYS.DAILY_TASKS, dailyTasks);

// Initialize storage with default data
export const initializeStorage = (
  defaultUser: User,
  defaultSkills: Skill[],
  defaultAchievements: Achievement[],
  defaultCategories: Category[],
  defaultTasks: Task[],
  defaultRewards: Reward[]
): void => {
  // Only initialize if storage is empty
  if (!getUser()) {
    // Ensure user has the meditation field initialized
    const userWithMeditation = {
      ...defaultUser,
      meditation: {
        streak: 0,
        lastMeditated: '',
        completedMeditations: [],
        unlockedSecretMeditation: false
      }
    };
    setUser(userWithMeditation);
  }
  
  if (getSkills().length === 0) setSkills(defaultSkills);
  if (getAchievements().length === 0) setAchievements(defaultAchievements);
  if (getCategories().length === 0) setCategories(defaultCategories);
  if (getTasks().length === 0) setTasks(defaultTasks);
  if (getRewards().length === 0) setRewards(defaultRewards);
  
  // Set initialized flag
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
};

// Backup and restore user data functions
export const exportUserData = (): string => {
  const userData = {
    user: getUser(),
    tasks: getTasks(),
    skills: getSkills(),
    achievements: getAchievements(),
    categories: getCategories(),
    rewards: getRewards(),
    dailyTasks: getDailyTasks()
  };
  
  return JSON.stringify(userData);
};

export const importUserData = (jsonData: string): boolean => {
  try {
    const userData = JSON.parse(jsonData);
    
    if (userData.user) setUser(userData.user);
    if (userData.tasks) setTasks(userData.tasks);
    if (userData.skills) setSkills(userData.skills);
    if (userData.achievements) setAchievements(userData.achievements);
    if (userData.categories) setCategories(userData.categories);
    if (userData.rewards) setRewards(userData.rewards);
    if (userData.dailyTasks) setDailyTasks(userData.dailyTasks);
    
    return true;
  } catch (error) {
    console.error("Failed to import user data:", error);
    return false;
  }
};
