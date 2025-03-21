
import { 
  initializeStorage 
} from './storageService';
import { 
  user as defaultUser, 
  skills as defaultSkills, 
  achievements as defaultAchievements,
  categories as defaultCategories,
  tasks as defaultTasks,
  rewards as defaultRewards
} from '@/data/mockData';

export const initializeApp = () => {
  // Initialize the app with default data if it doesn't exist
  initializeStorage(
    defaultUser,
    defaultSkills,
    defaultAchievements,
    defaultCategories,
    defaultTasks,
    defaultRewards
  );
  
  console.log('App initialized with default data if needed');
  
  // Here you might also check for app updates, migrate data, etc.
};
