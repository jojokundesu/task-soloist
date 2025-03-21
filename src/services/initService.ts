
import { 
  initializeStorage,
  checkStorageInitialized
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
  console.log('Initializing app...');
  
  // Check if data is already initialized
  const isInitialized = checkStorageInitialized();
  
  if (!isInitialized) {
    console.log('App data not found - setting up default data');
    // Initialize the app with default data if it doesn't exist
    initializeStorage(
      defaultUser,
      defaultSkills,
      defaultAchievements,
      defaultCategories,
      defaultTasks,
      defaultRewards
    );
    
    // Set a flag that we've initialized the data
    localStorage.setItem('app_initialized', 'true');
    
    console.log('App initialized with default data');
  } else {
    console.log('App data already exists, using stored data');
  }
  
  // Register a service worker if supported (for better offline capabilities)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        () => console.log('ServiceWorker registered'),
        error => console.log('ServiceWorker registration failed: ', error)
      );
    });
  }
};
