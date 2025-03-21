
import { Achievement, Category, Reward, Skill, Task, User } from "@/types";

// Sample user data
export const user: User = {
  id: "user1",
  name: "Hunter",
  rank: "E-Rank Hunter",
  level: 1,
  experience: 20,
  nextLevelExperience: 100,
  currency: 5,
  stats: {
    strength: 2,
    intelligence: 3,
    charisma: 1,
    endurance: 2,
    focus: 2,
  },
  skills: [],
  achievements: [],
};

// Sample skills
export const skills: Skill[] = [
  {
    id: "skill1",
    name: "Physical Fitness",
    level: 1,
    experience: 25,
    nextLevelExp: 100,
    icon: "activity",
  },
  {
    id: "skill2",
    name: "Reading",
    level: 2,
    experience: 60,
    nextLevelExp: 100,
    icon: "book-open",
  },
  {
    id: "skill3",
    name: "Meditation",
    level: 1,
    experience: 15,
    nextLevelExp: 100,
    icon: "brain",
  },
  {
    id: "skill4",
    name: "Language Learning",
    level: 0,
    experience: 5,
    nextLevelExp: 50,
    icon: "languages",
  },
  {
    id: "skill5",
    name: "Time Management",
    level: 1,
    experience: 30,
    nextLevelExp: 100,
    icon: "clock",
  },
];

// Sample categories
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Physical",
    color: "#0EA5E9",
    icon: "activity",
  },
  {
    id: "cat2",
    name: "Mental",
    color: "#8B5CF6",
    icon: "brain",
  },
  {
    id: "cat3",
    name: "Social",
    color: "#D946EF",
    icon: "users",
  },
  {
    id: "cat4",
    name: "Learning",
    color: "#F97316",
    icon: "book-open",
  },
  {
    id: "cat5",
    name: "Productivity",
    color: "#0FA0CE",
    icon: "check-circle",
  },
];

// Sample achievements
export const achievements: Achievement[] = [
  {
    id: "ach1",
    name: "First Steps",
    description: "Complete your first task",
    completed: true,
    icon: "footprints",
    reward: 10,
    unlockCondition: "Complete 1 task",
  },
  {
    id: "ach2",
    name: "Early Bird",
    description: "Complete a task before 8 AM",
    completed: false,
    icon: "sun",
    reward: 15,
    unlockCondition: "Complete a task before 8 AM",
  },
  {
    id: "ach3",
    name: "Streak Master",
    description: "Complete tasks for 7 consecutive days",
    completed: false,
    icon: "flame",
    reward: 50,
    unlockCondition: "7-day streak",
  },
  {
    id: "ach4",
    name: "Knowledge Seeker",
    description: "Read for 30 days",
    completed: false,
    icon: "book",
    reward: 75,
    unlockCondition: "Complete reading tasks for 30 days",
  },
  {
    id: "ach5",
    name: "Fitness Enthusiast",
    description: "Complete 20 workout tasks",
    completed: false,
    icon: "dumbbell",
    reward: 100,
    unlockCondition: "Complete 20 workout tasks",
  },
];

// Sample tasks
export const tasks: Task[] = [
  {
    id: "task1",
    title: "Morning workout",
    description: "30 minutes of cardio or strength training",
    completed: false,
    date: new Date().toISOString(),
    recurring: true,
    xpReward: 15,
    category: "cat1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task2",
    title: "Read 20 pages",
    description: "Read from your current book",
    completed: false,
    date: new Date().toISOString(),
    recurring: true,
    xpReward: 10,
    category: "cat4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task3",
    title: "Meditate for 10 minutes",
    description: "Practice mindfulness meditation",
    completed: false,
    date: new Date().toISOString(),
    recurring: true,
    xpReward: 5,
    category: "cat2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task4",
    title: "Study foreign language",
    description: "Practice vocabulary and grammar for 15 minutes",
    completed: false,
    date: new Date().toISOString(),
    recurring: true,
    xpReward: 10,
    category: "cat4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task5",
    title: "Call a friend or family member",
    description: "Maintain social connections",
    completed: false,
    date: new Date().toISOString(),
    recurring: false,
    xpReward: 5,
    category: "cat3",
    createdAt: new Date().toISOString(),
  },
];

// Sample rewards
export const rewards: Reward[] = [
  {
    id: "reward1",
    name: "Video Game Time",
    description: "30 minutes of guilt-free gaming",
    cost: 20,
    claimed: false,
    icon: "gamepad-2",
  },
  {
    id: "reward2",
    name: "Movie Night",
    description: "Watch a movie of your choice",
    cost: 30,
    claimed: false,
    icon: "film",
  },
  {
    id: "reward3",
    name: "Dessert Treat",
    description: "Enjoy your favorite dessert",
    cost: 15,
    claimed: false,
    icon: "cake",
  },
  {
    id: "reward4",
    name: "Social Media Break",
    description: "30 minutes of social media browsing",
    cost: 10,
    claimed: false,
    icon: "smartphone",
  },
];
