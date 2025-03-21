
import { Task, User, Skill, Achievement, Category, Reward, DailyTask } from "@/types";

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
  if (!getUser()) setUser(defaultUser);
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
