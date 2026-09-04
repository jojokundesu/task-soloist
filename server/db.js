import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'task-soloist.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rank TEXT NOT NULL DEFAULT 'E-Rank Hunter',
      level INTEGER NOT NULL DEFAULT 1,
      experience INTEGER NOT NULL DEFAULT 0,
      next_level_experience INTEGER NOT NULL DEFAULT 100,
      currency INTEGER NOT NULL DEFAULT 0,
      strength INTEGER NOT NULL DEFAULT 2,
      intelligence INTEGER NOT NULL DEFAULT 3,
      charisma INTEGER NOT NULL DEFAULT 1,
      endurance INTEGER NOT NULL DEFAULT 2,
      focus INTEGER NOT NULL DEFAULT 2,
      age INTEGER,
      height REAL,
      weight REAL,
      body_fat REAL,
      title TEXT DEFAULT 'Shadow Monarch',
      avatar TEXT DEFAULT 'hunter',
      total_xp_earned INTEGER NOT NULL DEFAULT 0,
      tasks_completed INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      meditation_streak INTEGER NOT NULL DEFAULT 0,
      last_meditated TEXT DEFAULT '',
      completed_meditations TEXT DEFAULT '[]',
      unlocked_secret_meditation INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 1,
      experience INTEGER NOT NULL DEFAULT 0,
      next_level_exp INTEGER NOT NULL DEFAULT 100,
      icon TEXT,
      category_id TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      icon TEXT NOT NULL,
      reward INTEGER NOT NULL DEFAULT 0,
      unlock_condition TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      progress INTEGER NOT NULL DEFAULT 0,
      target INTEGER NOT NULL DEFAULT 1,
      unlocked_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL,
      due_date TEXT,
      recurring INTEGER NOT NULL DEFAULT 0,
      recurring_type TEXT,
      xp_reward INTEGER NOT NULL DEFAULT 10,
      currency_reward INTEGER NOT NULL DEFAULT 1,
      category_id TEXT,
      skill_id TEXT,
      priority TEXT DEFAULT 'medium',
      difficulty TEXT DEFAULT 'normal',
      notes TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      cost INTEGER NOT NULL,
      claimed INTEGER NOT NULL DEFAULT 0,
      icon TEXT,
      claimed_at TEXT,
      times_claimed INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      xp_gained INTEGER DEFAULT 0,
      currency_gained INTEGER DEFAULT 0,
      meta TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      tasks_completed INTEGER NOT NULL DEFAULT 0,
      tasks_created INTEGER NOT NULL DEFAULT 0,
      xp_gained INTEGER NOT NULL DEFAULT 0,
      currency_gained INTEGER NOT NULL DEFAULT 0,
      meditations INTEGER NOT NULL DEFAULT 0,
      meditation_minutes INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS meditation_sessions (
      id TEXT PRIMARY KEY,
      meditation_id TEXT NOT NULL,
      meditation_name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      is_error INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT 'flame',
      color TEXT DEFAULT '#8B5CF6',
      xp_reward INTEGER NOT NULL DEFAULT 5,
      target_days INTEGER NOT NULL DEFAULT 7,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      total_completions INTEGER NOT NULL DEFAULT 0,
      last_completed TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 1,
      UNIQUE(habit_id, date)
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT NOT NULL,
      mood INTEGER DEFAULT 3,
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL DEFAULT 'consumable',
      rarity TEXT NOT NULL DEFAULT 'common',
      icon TEXT DEFAULT 'package',
      quantity INTEGER NOT NULL DEFAULT 1,
      effect TEXT,
      obtained_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL DEFAULT 'daily',
      status TEXT NOT NULL DEFAULT 'active',
      progress INTEGER NOT NULL DEFAULT 0,
      target INTEGER NOT NULL DEFAULT 1,
      xp_reward INTEGER NOT NULL DEFAULT 25,
      currency_reward INTEGER NOT NULL DEFAULT 5,
      expires_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().split('T')[0];

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

export function rankForLevel(level) {
  let rank = RANKS[0].rank;
  for (const r of RANKS) {
    if (level >= r.min) rank = r.rank;
  }
  return rank;
}

function seedIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount > 0) return;

  const ts = now();
  const userId = 'user1';

  db.prepare(`
    INSERT INTO users (
      id, name, rank, level, experience, next_level_experience, currency,
      strength, intelligence, charisma, endurance, focus,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, 'Hunter', 'E-Rank Hunter', 1, 20, 100, 5, 2, 3, 1, 2, 2, ts, ts);

  const categories = [
    ['cat1', 'Physical', '#0EA5E9', 'activity'],
    ['cat2', 'Mental', '#8B5CF6', 'brain'],
    ['cat3', 'Social', '#D946EF', 'users'],
    ['cat4', 'Learning', '#F97316', 'book-open'],
    ['cat5', 'Productivity', '#0FA0CE', 'check-circle'],
  ];
  const catStmt = db.prepare('INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?)');
  for (const c of categories) catStmt.run(...c);

  const skills = [
    ['skill1', 'Physical Fitness', 1, 25, 100, 'activity', 'cat1', 'Build strength and endurance'],
    ['skill2', 'Reading', 2, 60, 100, 'book-open', 'cat4', 'Expand knowledge through books'],
    ['skill3', 'Meditation', 1, 15, 100, 'brain', 'cat2', 'Master the mind through stillness'],
    ['skill4', 'Language Learning', 0, 5, 50, 'languages', 'cat4', 'Communicate across cultures'],
    ['skill5', 'Time Management', 1, 30, 100, 'clock', 'cat5', 'Command your hours wisely'],
    ['skill6', 'Creativity', 1, 10, 100, 'palette', 'cat2', 'Channel creative shadow energy'],
    ['skill7', 'Discipline', 1, 20, 100, 'shield', 'cat5', 'Forge unbreakable will'],
  ];
  const skillStmt = db.prepare(
    'INSERT INTO skills (id, name, level, experience, next_level_exp, icon, category_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (const s of skills) skillStmt.run(...s);

  const achievements = [
    ['ach1', 'First Steps', 'Complete your first task', 0, 'footprints', 10, 'Complete 1 task', 'tasks', 0, 1],
    ['ach2', 'Early Bird', 'Complete a task before 8 AM', 0, 'sun', 15, 'Complete a task before 8 AM', 'tasks', 0, 1],
    ['ach3', 'Streak Master', 'Complete tasks for 7 consecutive days', 0, 'flame', 50, '7-day streak', 'streaks', 0, 7],
    ['ach4', 'Knowledge Seeker', 'Complete 30 learning tasks', 0, 'book', 75, 'Complete 30 learning tasks', 'skills', 0, 30],
    ['ach5', 'Fitness Enthusiast', 'Complete 20 workout tasks', 0, 'dumbbell', 100, 'Complete 20 workout tasks', 'skills', 0, 20],
    ['ach6', 'Shadow Apprentice', 'Reach level 5', 0, 'star', 25, 'Reach level 5', 'level', 0, 5],
    ['ach7', 'Currency Collector', 'Earn 100 shadow coins', 0, 'coins', 30, 'Earn 100 currency', 'economy', 0, 100],
    ['ach8', 'Meditation Initiate', 'Complete 5 meditation sessions', 0, 'brain', 40, 'Meditate 5 times', 'meditation', 0, 5],
    ['ach9', 'Quest Conqueror', 'Complete 50 tasks', 0, 'trophy', 80, 'Complete 50 tasks', 'tasks', 0, 50],
    ['ach10', 'Habit Forge', 'Maintain a 14-day habit streak', 0, 'flame', 60, '14-day habit streak', 'habits', 0, 14],
    ['ach11', 'Journal Keeper', 'Write 10 journal entries', 0, 'book-open', 35, 'Write 10 journal entries', 'journal', 0, 10],
    ['ach12', 'Rank Climber', 'Reach C-Rank Hunter', 0, 'shield', 100, 'Reach level 10', 'level', 0, 10],
    ['ach13', 'Night Owl', 'Complete a task after 10 PM', 0, 'moon', 15, 'Complete a task after 10 PM', 'tasks', 0, 1],
    ['ach14', 'Perfect Day', 'Complete all daily tasks in one day', 0, 'check-circle', 40, 'Complete all tasks in a day', 'tasks', 0, 1],
    ['ach15', 'Shadow Sovereign', 'Reach level 50', 0, 'crown', 500, 'Reach level 50', 'level', 0, 50],
  ];
  const achStmt = db.prepare(
    'INSERT INTO achievements (id, name, description, completed, icon, reward, unlock_condition, category, progress, target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (const a of achievements) achStmt.run(...a);

  const dateIso = now();
  const tasks = [
    ['task1', 'Morning workout', '30 minutes of cardio or strength training', 0, dateIso, 1, 'daily', 15, 2, 'cat1', 'skill1', 'high', 'normal'],
    ['task2', 'Read 20 pages', 'Read from your current book', 0, dateIso, 1, 'daily', 10, 1, 'cat4', 'skill2', 'medium', 'normal'],
    ['task3', 'Meditate for 10 minutes', 'Practice mindfulness meditation', 0, dateIso, 1, 'daily', 5, 1, 'cat2', 'skill3', 'medium', 'easy'],
    ['task4', 'Study foreign language', 'Practice vocabulary and grammar for 15 minutes', 0, dateIso, 1, 'daily', 10, 1, 'cat4', 'skill4', 'medium', 'normal'],
    ['task5', 'Call a friend or family member', 'Maintain social connections', 0, dateIso, 0, null, 5, 1, 'cat3', null, 'low', 'easy'],
    ['task6', 'Plan tomorrow\'s quests', 'Review and organize upcoming tasks', 0, dateIso, 1, 'daily', 8, 1, 'cat5', 'skill5', 'medium', 'easy'],
    ['task7', 'Creative practice', 'Spend 20 minutes on a creative hobby', 0, dateIso, 0, null, 12, 2, 'cat2', 'skill6', 'medium', 'normal'],
  ];
  const taskStmt = db.prepare(`
    INSERT INTO tasks (
      id, title, description, completed, date, recurring, recurring_type,
      xp_reward, currency_reward, category_id, skill_id, priority, difficulty, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of tasks) taskStmt.run(...t, ts, ts);

  const rewards = [
    ['reward1', 'Video Game Time', '30 minutes of guilt-free gaming', 20, 0, 'gamepad-2'],
    ['reward2', 'Movie Night', 'Watch a movie of your choice', 30, 0, 'film'],
    ['reward3', 'Dessert Treat', 'Enjoy your favorite dessert', 15, 0, 'cake'],
    ['reward4', 'Social Media Break', '30 minutes of social media browsing', 10, 0, 'smartphone'],
    ['reward5', 'Sleep In', 'Extra 30 minutes of sleep', 25, 0, 'moon'],
    ['reward6', 'Favorite Meal', 'Order or cook your favorite meal', 40, 0, 'utensils'],
    ['reward7', 'Day Off Quest', 'Skip one non-critical daily quest', 50, 0, 'coffee'],
  ];
  const rewardStmt = db.prepare(
    'INSERT INTO rewards (id, name, description, cost, claimed, icon) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const r of rewards) rewardStmt.run(...r);

  const habits = [
    ['habit1', 'Drink Water', 'Drink 8 glasses of water', 'droplets', '#0EA5E9', 5, 7],
    ['habit2', 'Morning Stretch', '5 minutes of stretching', 'activity', '#22C55E', 5, 7],
    ['habit3', 'No Phone Morning', 'First 30 min without phone', 'smartphone', '#F59E0B', 8, 14],
    ['habit4', 'Gratitude', 'Write 3 things you\'re grateful for', 'heart', '#EC4899', 5, 7],
  ];
  const habitStmt = db.prepare(`
    INSERT INTO habits (id, name, description, icon, color, xp_reward, target_days, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const h of habits) habitStmt.run(...h, ts);

  const quests = [
    ['quest1', 'Daily Dominator', 'Complete 3 tasks today', 'daily', 'active', 0, 3, 30, 5],
    ['quest2', 'Mindful Shadow', 'Complete a meditation session', 'daily', 'active', 0, 1, 20, 3],
    ['quest3', 'Habit Keeper', 'Complete 2 habits today', 'daily', 'active', 0, 2, 15, 2],
    ['quest4', 'Weekly Warrior', 'Complete 15 tasks this week', 'weekly', 'active', 0, 15, 100, 20],
    ['quest5', 'Skill Seeker', 'Gain XP in any skill', 'daily', 'active', 0, 1, 15, 2],
  ];
  const questStmt = db.prepare(`
    INSERT INTO quests (id, title, description, type, status, progress, target, xp_reward, currency_reward, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const q of quests) questStmt.run(...q, ts);

  // Starter inventory
  db.prepare(`
    INSERT INTO inventory_items (id, name, description, type, rarity, icon, quantity, effect, obtained_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'item1',
    'Shadow Essence',
    'A faint wisp of shadow energy. Consume to gain +10 XP.',
    'consumable',
    'common',
    'sparkles',
    3,
    JSON.stringify({ xp: 10 }),
    ts
  );

  db.prepare(`
    INSERT INTO inventory_items (id, name, description, type, rarity, icon, quantity, effect, obtained_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'item2',
    'Hunter\'s Token',
    'A token of determination. Consume to gain +5 currency.',
    'consumable',
    'uncommon',
    'coins',
    1,
    JSON.stringify({ currency: 5 }),
    ts
  );

  logActivity('system', 'System Initialized', 'Your journey as a hunter begins.', 0, 0);
}

export function logActivity(type, title, description = '', xp = 0, currency = 0, meta = null) {
  db.prepare(`
    INSERT INTO activity_log (id, type, title, description, xp_gained, currency_gained, meta, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), type, title, description, xp, currency, meta ? JSON.stringify(meta) : null, now());
}

export function bumpDailyStats(field, amount = 1, date = today()) {
  db.prepare(`
    INSERT INTO daily_stats (date, ${field}) VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET ${field} = ${field} + ?
  `).run(date, amount, amount);
}

export function getUser() {
  const row = db.prepare('SELECT * FROM users LIMIT 1').get();
  if (!row) return null;
  return mapUser(row);
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    level: row.level,
    experience: row.experience,
    nextLevelExperience: row.next_level_experience,
    currency: row.currency,
    stats: {
      strength: row.strength,
      intelligence: row.intelligence,
      charisma: row.charisma,
      endurance: row.endurance,
      focus: row.focus,
    },
    profile: {
      age: row.age,
      height: row.height,
      weight: row.weight,
      bodyFatPercentage: row.body_fat,
      title: row.title,
      avatar: row.avatar,
    },
    totals: {
      totalXpEarned: row.total_xp_earned,
      tasksCompleted: row.tasks_completed,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastActiveDate: row.last_active_date,
    },
    meditation: {
      streak: row.meditation_streak,
      lastMeditated: row.last_meditated || '',
      completedMeditations: JSON.parse(row.completed_meditations || '[]'),
      unlockedSecretMeditation: !!row.unlocked_secret_meditation,
    },
    skills: [],
    achievements: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function updateUserFields(fields) {
  const allowed = {
    name: 'name',
    rank: 'rank',
    level: 'level',
    experience: 'experience',
    nextLevelExperience: 'next_level_experience',
    currency: 'currency',
    strength: 'strength',
    intelligence: 'intelligence',
    charisma: 'charisma',
    endurance: 'endurance',
    focus: 'focus',
    age: 'age',
    height: 'height',
    weight: 'weight',
    bodyFatPercentage: 'body_fat',
    title: 'title',
    avatar: 'avatar',
    totalXpEarned: 'total_xp_earned',
    tasksCompleted: 'tasks_completed',
    currentStreak: 'current_streak',
    longestStreak: 'longest_streak',
    lastActiveDate: 'last_active_date',
    meditationStreak: 'meditation_streak',
    lastMeditated: 'last_meditated',
    completedMeditations: 'completed_meditations',
    unlockedSecretMeditation: 'unlocked_secret_meditation',
  };

  const sets = [];
  const values = [];
  for (const [k, v] of Object.entries(fields)) {
    if (allowed[k]) {
      sets.push(`${allowed[k]} = ?`);
      values.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
    }
  }
  if (!sets.length) return getUser();
  sets.push('updated_at = ?');
  values.push(now());
  const user = db.prepare('SELECT id FROM users LIMIT 1').get();
  values.push(user.id);
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return getUser();
}

export function addExperience(amount, source = 'task') {
  const user = getUser();
  if (!user || amount <= 0) return { user, leveledUp: false, levelsGained: 0 };

  let exp = user.experience + amount;
  let level = user.level;
  let next = user.nextLevelExperience;
  let levelsGained = 0;
  const leveledStats = {};

  while (exp >= next) {
    exp -= next;
    level += 1;
    levelsGained += 1;
    next = Math.floor(next * 1.45);
    // slight stat bumps on level up
    leveledStats.strength = (leveledStats.strength || user.stats.strength) + (levelsGained % 2 === 0 ? 1 : 0);
    leveledStats.intelligence = (leveledStats.intelligence || user.stats.intelligence) + (levelsGained % 3 === 0 ? 1 : 0);
    leveledStats.endurance = (leveledStats.endurance || user.stats.endurance) + (levelsGained % 2 === 1 ? 1 : 0);
    leveledStats.focus = (leveledStats.focus || user.stats.focus) + (levelsGained % 4 === 0 ? 1 : 0);
    leveledStats.charisma = (leveledStats.charisma || user.stats.charisma) + (levelsGained % 5 === 0 ? 1 : 0);
  }

  const updates = {
    experience: exp,
    level,
    nextLevelExperience: next,
    rank: rankForLevel(level),
    totalXpEarned: user.totals.totalXpEarned + amount,
  };
  if (levelsGained > 0) {
    Object.assign(updates, {
      strength: leveledStats.strength || user.stats.strength,
      intelligence: leveledStats.intelligence || user.stats.intelligence,
      endurance: leveledStats.endurance || user.stats.endurance,
      focus: leveledStats.focus || user.stats.focus,
      charisma: leveledStats.charisma || user.stats.charisma,
    });
  }

  const updated = updateUserFields(updates);
  checkLevelAchievements(level);
  return { user: updated, leveledUp: levelsGained > 0, levelsGained, amount, source };
}

export function addCurrency(amount) {
  const user = getUser();
  if (!user) return null;
  const updated = updateUserFields({ currency: Math.max(0, user.currency + amount) });
  if (amount > 0) {
    checkAchievementProgress('ach7', updated.currency);
  }
  return updated;
}

export function addSkillXp(skillId, amount) {
  if (!skillId || amount <= 0) return null;
  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
  if (!skill) return null;

  let exp = skill.experience + amount;
  let level = skill.level;
  let next = skill.next_level_exp;
  let leveled = false;

  while (exp >= next) {
    exp -= next;
    level += 1;
    next = Math.floor(next * 1.4);
    leveled = true;
  }

  db.prepare('UPDATE skills SET experience = ?, level = ?, next_level_exp = ? WHERE id = ?').run(
    exp,
    level,
    next,
    skillId
  );

  if (leveled) {
    logActivity('skill_level', `${skill.name} leveled up!`, `Reached level ${level}`, 5, 0, { skillId, level });
    addExperience(5, 'skill');
  }

  return getSkills().find((s) => s.id === skillId);
}

function checkLevelAchievements(level) {
  if (level >= 5) unlockAchievement('ach6');
  if (level >= 10) unlockAchievement('ach12');
  if (level >= 50) unlockAchievement('ach15');
}

export function checkAchievementProgress(id, progress) {
  const ach = db.prepare('SELECT * FROM achievements WHERE id = ?').get(id);
  if (!ach || ach.completed) return null;
  const newProgress = Math.min(progress, ach.target);
  db.prepare('UPDATE achievements SET progress = ? WHERE id = ?').run(newProgress, id);
  if (newProgress >= ach.target) {
    return unlockAchievement(id);
  }
  return null;
}

export function unlockAchievement(id) {
  const ach = db.prepare('SELECT * FROM achievements WHERE id = ?').get(id);
  if (!ach || ach.completed) return null;

  db.prepare(
    'UPDATE achievements SET completed = 1, progress = target, unlocked_at = ? WHERE id = ?'
  ).run(now(), id);

  addExperience(ach.reward, 'achievement');
  addCurrency(Math.ceil(ach.reward / 5));
  logActivity('achievement', `Achievement unlocked: ${ach.name}`, ach.description, ach.reward, Math.ceil(ach.reward / 5));

  // Chance to drop inventory item
  if (Math.random() < 0.4) {
    grantRandomItem();
  }

  return getAchievements().find((a) => a.id === id);
}

function grantRandomItem() {
  const drops = [
    { name: 'Shadow Essence', description: 'Gain +10 XP when consumed.', type: 'consumable', rarity: 'common', icon: 'sparkles', effect: { xp: 10 } },
    { name: 'Hunter\'s Token', description: 'Gain +5 currency when consumed.', type: 'consumable', rarity: 'uncommon', icon: 'coins', effect: { currency: 5 } },
    { name: 'Focus Potion', description: 'Gain +15 XP and +1 focus when consumed.', type: 'consumable', rarity: 'rare', icon: 'flask', effect: { xp: 15, focus: 1 } },
    { name: 'Vitality Orb', description: 'Gain +20 XP and +1 endurance.', type: 'consumable', rarity: 'rare', icon: 'heart', effect: { xp: 20, endurance: 1 } },
  ];
  const drop = drops[Math.floor(Math.random() * drops.length)];
  const existing = db
    .prepare('SELECT * FROM inventory_items WHERE name = ? AND type = ?')
    .get(drop.name, drop.type);
  if (existing) {
    db.prepare('UPDATE inventory_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
  } else {
    db.prepare(`
      INSERT INTO inventory_items (id, name, description, type, rarity, icon, quantity, effect, obtained_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(uuidv4(), drop.name, drop.description, drop.type, drop.rarity, drop.icon, JSON.stringify(drop.effect), now());
  }
  logActivity('item', `Obtained ${drop.name}`, drop.description, 0, 0);
}

export function getTasks(filters = {}) {
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  if (filters.completed !== undefined) {
    sql += ' AND completed = ?';
    params.push(filters.completed ? 1 : 0);
  }
  if (filters.date) {
    sql += ' AND date(date) = date(?)';
    params.push(filters.date);
  }
  if (filters.categoryId) {
    sql += ' AND category_id = ?';
    params.push(filters.categoryId);
  }
  if (filters.search) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  sql += ' ORDER BY completed ASC, CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 ELSE 2 END, date DESC';
  return db.prepare(sql).all(...params).map(mapTask);
}

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    completed: !!row.completed,
    date: row.date,
    dueDate: row.due_date,
    recurring: !!row.recurring,
    recurringType: row.recurring_type,
    xpReward: row.xp_reward,
    currencyReward: row.currency_reward,
    category: row.category_id,
    skillId: row.skill_id,
    priority: row.priority || 'medium',
    difficulty: row.difficulty || 'normal',
    notes: row.notes || '',
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createTask(data) {
  const id = data.id || uuidv4();
  const ts = now();
  db.prepare(`
    INSERT INTO tasks (
      id, title, description, completed, date, due_date, recurring, recurring_type,
      xp_reward, currency_reward, category_id, skill_id, priority, difficulty, notes, created_at, updated_at
    ) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.title,
    data.description || '',
    data.date || ts,
    data.dueDate || null,
    data.recurring ? 1 : 0,
    data.recurringType || null,
    data.xpReward ?? 10,
    data.currencyReward ?? 1,
    data.category || null,
    data.skillId || null,
    data.priority || 'medium',
    data.difficulty || 'normal',
    data.notes || '',
    ts,
    ts
  );
  bumpDailyStats('tasks_created', 1);
  logActivity('task_created', `Quest created: ${data.title}`, data.description || '', 0, 0);
  return getTasks().find((t) => t.id === id);
}

export function updateTask(id, updates) {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return null;

  const map = {
    title: 'title',
    description: 'description',
    completed: 'completed',
    date: 'date',
    dueDate: 'due_date',
    recurring: 'recurring',
    recurringType: 'recurring_type',
    xpReward: 'xp_reward',
    currencyReward: 'currency_reward',
    category: 'category_id',
    skillId: 'skill_id',
    priority: 'priority',
    difficulty: 'difficulty',
    notes: 'notes',
    completedAt: 'completed_at',
  };

  const sets = [];
  const values = [];
  for (const [k, v] of Object.entries(updates)) {
    if (map[k]) {
      sets.push(`${map[k]} = ?`);
      let val = v;
      if (k === 'completed' || k === 'recurring') val = v ? 1 : 0;
      values.push(val);
    }
  }
  sets.push('updated_at = ?');
  values.push(now());
  values.push(id);
  db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`).run(...values);

  // Handle completion side effects
  if (updates.completed === true && !existing.completed) {
    completeTaskSideEffects(id, existing);
  } else if (updates.completed === false && existing.completed) {
    // reverse is intentional undo — don't reverse XP to keep simple, just mark incomplete
    db.prepare('UPDATE tasks SET completed_at = NULL WHERE id = ?').run(id);
  }

  return getTasks({}).find((t) => t.id === id) || mapTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
}

function completeTaskSideEffects(id, existing) {
  const ts = now();
  db.prepare('UPDATE tasks SET completed_at = ? WHERE id = ?').run(ts, id);

  const xp = existing.xp_reward || 10;
  const currency = existing.currency_reward || 1;
  const xpResult = addExperience(xp, 'task');
  addCurrency(currency);
  bumpDailyStats('tasks_completed', 1);
  bumpDailyStats('xp_gained', xp);
  bumpDailyStats('currency_gained', currency);

  if (existing.skill_id) {
    addSkillXp(existing.skill_id, Math.ceil(xp / 2));
  }

  const user = getUser();
  updateUserFields({
    tasksCompleted: user.totals.tasksCompleted + 1,
    lastActiveDate: today(),
  });
  updateStreak();

  // achievements
  checkAchievementProgress('ach1', 1);
  checkAchievementProgress('ach9', user.totals.tasksCompleted + 1);

  const hour = new Date().getHours();
  if (hour < 8) unlockAchievement('ach2');
  if (hour >= 22) unlockAchievement('ach13');

  if (existing.category_id === 'cat1') {
    const count = db
      .prepare("SELECT COUNT(*) as c FROM tasks WHERE category_id = 'cat1' AND completed = 1")
      .get().c;
    checkAchievementProgress('ach5', count);
  }
  if (existing.category_id === 'cat4') {
    const count = db
      .prepare("SELECT COUNT(*) as c FROM tasks WHERE category_id = 'cat4' AND completed = 1")
      .get().c;
    checkAchievementProgress('ach4', count);
  }

  // daily quest progress
  bumpQuestProgress('daily', 'tasks');
  // perfect day check
  const pendingToday = db
    .prepare("SELECT COUNT(*) as c FROM tasks WHERE date(date) = date('now') AND completed = 0 AND recurring = 1")
    .get().c;
  if (pendingToday === 0) {
    unlockAchievement('ach14');
  }

  logActivity('task_completed', `Quest completed: ${existing.title}`, `+${xp} XP, +${currency} coins`, xp, currency);

  // small chance of item drop
  if (Math.random() < 0.15) grantRandomItem();

  return xpResult;
}

function updateStreak() {
  const user = getUser();
  const t = today();
  let streak = user.totals.currentStreak || 0;
  const last = user.totals.lastActiveDate;

  if (last === t) {
    // already counted today
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (last === yStr) streak += 1;
    else streak = 1;

    const longest = Math.max(user.totals.longestStreak || 0, streak);
    updateUserFields({
      currentStreak: streak,
      longestStreak: longest,
      lastActiveDate: t,
    });
    checkAchievementProgress('ach3', streak);
  }
}

export function deleteTask(id) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return true;
}

export function getSkills() {
  return db.prepare('SELECT * FROM skills ORDER BY level DESC, name').all().map((s) => ({
    id: s.id,
    name: s.name,
    level: s.level,
    experience: s.experience,
    nextLevelExp: s.next_level_exp,
    icon: s.icon,
    categoryId: s.category_id,
    description: s.description,
  }));
}

export function getAchievements() {
  return db.prepare('SELECT * FROM achievements ORDER BY completed DESC, name').all().map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    completed: !!a.completed,
    icon: a.icon,
    reward: a.reward,
    unlockCondition: a.unlock_condition,
    category: a.category,
    progress: a.progress,
    target: a.target,
    unlockedAt: a.unlocked_at,
  }));
}

export function getCategories() {
  return db.prepare('SELECT * FROM categories').all().map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
    icon: c.icon,
  }));
}

export function getRewards() {
  return db.prepare('SELECT * FROM rewards ORDER BY cost').all().map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    cost: r.cost,
    claimed: !!r.claimed,
    icon: r.icon,
    claimedAt: r.claimed_at,
    timesClaimed: r.times_claimed,
  }));
}

export function claimReward(id) {
  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(id);
  if (!reward) return { error: 'Reward not found' };
  const user = getUser();
  if (user.currency < reward.cost) return { error: 'Not enough currency' };

  addCurrency(-reward.cost);
  db.prepare(
    'UPDATE rewards SET claimed = 1, claimed_at = ?, times_claimed = times_claimed + 1 WHERE id = ?'
  ).run(now(), id);
  // Allow reclaiming later by resetting claimed after a short while conceptually — keep claimed but allow multiple times
  db.prepare('UPDATE rewards SET claimed = 0 WHERE id = ?').run(id);

  logActivity('reward', `Claimed reward: ${reward.name}`, reward.description, 0, -reward.cost);
  return { reward: getRewards().find((r) => r.id === id), user: getUser() };
}

export function createReward(data) {
  const id = uuidv4();
  db.prepare(
    'INSERT INTO rewards (id, name, description, cost, claimed, icon) VALUES (?, ?, ?, ?, 0, ?)'
  ).run(id, data.name, data.description || '', data.cost || 10, data.icon || 'gift');
  return getRewards().find((r) => r.id === id);
}

export function getHabits() {
  return db.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY name').all().map(mapHabit);
}

function mapHabit(h) {
  const logs = db
    .prepare('SELECT date FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date DESC LIMIT 30')
    .all(h.id)
    .map((l) => l.date);
  return {
    id: h.id,
    name: h.name,
    description: h.description,
    icon: h.icon,
    color: h.color,
    xpReward: h.xp_reward,
    targetDays: h.target_days,
    currentStreak: h.current_streak,
    longestStreak: h.longest_streak,
    totalCompletions: h.total_completions,
    lastCompleted: h.last_completed,
    completedToday: logs.includes(today()),
    recentLogs: logs,
    createdAt: h.created_at,
  };
}

export function createHabit(data) {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO habits (id, name, description, icon, color, xp_reward, target_days, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.description || '',
    data.icon || 'flame',
    data.color || '#8B5CF6',
    data.xpReward || 5,
    data.targetDays || 7,
    now()
  );
  return getHabits().find((h) => h.id === id);
}

export function toggleHabit(id, date = today()) {
  const habit = db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
  if (!habit) return null;

  const existing = db.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?').get(id, date);
  if (existing) {
    db.prepare('DELETE FROM habit_logs WHERE id = ?').run(existing.id);
    // recalculate streak simply
    db.prepare(
      'UPDATE habits SET total_completions = MAX(0, total_completions - 1), last_completed = (SELECT MAX(date) FROM habit_logs WHERE habit_id = ?) WHERE id = ?'
    ).run(id, id);
    return getHabits().find((h) => h.id === id);
  }

  db.prepare('INSERT INTO habit_logs (id, habit_id, date, completed) VALUES (?, ?, ?, 1)').run(
    uuidv4(),
    id,
    date
  );

  let streak = habit.current_streak || 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  if (habit.last_completed === yStr || habit.last_completed === date) {
    if (habit.last_completed !== date) streak += 1;
  } else {
    streak = 1;
  }
  const longest = Math.max(habit.longest_streak || 0, streak);

  db.prepare(`
    UPDATE habits SET current_streak = ?, longest_streak = ?, total_completions = total_completions + 1, last_completed = ? WHERE id = ?
  `).run(streak, longest, date, id);

  addExperience(habit.xp_reward, 'habit');
  bumpQuestProgress('daily', 'habits');
  checkAchievementProgress('ach10', streak);
  logActivity('habit', `Habit completed: ${habit.name}`, `Streak: ${streak} days`, habit.xp_reward, 0);

  return getHabits().find((h) => h.id === id);
}

export function deleteHabit(id) {
  db.prepare('UPDATE habits SET active = 0 WHERE id = ?').run(id);
  return true;
}

export function getQuests() {
  return db.prepare("SELECT * FROM quests WHERE status != 'archived' ORDER BY type, created_at").all().map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    type: q.type,
    status: q.status,
    progress: q.progress,
    target: q.target,
    xpReward: q.xp_reward,
    currencyReward: q.currency_reward,
    expiresAt: q.expires_at,
    completedAt: q.completed_at,
    createdAt: q.created_at,
  }));
}

function bumpQuestProgress(type, kind) {
  const quests = db
    .prepare("SELECT * FROM quests WHERE status = 'active' AND type = ?")
    .all(type);
  for (const q of quests) {
    const title = (q.title + q.description).toLowerCase();
    let matches = false;
    if (kind === 'tasks' && (title.includes('task') || title.includes('quest') || title.includes('dominator') || title.includes('warrior'))) {
      matches = true;
    }
    if (kind === 'habits' && title.includes('habit')) matches = true;
    if (kind === 'meditation' && (title.includes('meditat') || title.includes('mindful'))) matches = true;
    if (kind === 'skill' && title.includes('skill')) matches = true;
    if (!matches && kind === 'tasks' && q.type === 'weekly') matches = true;

    if (matches) {
      const progress = Math.min(q.progress + 1, q.target);
      db.prepare('UPDATE quests SET progress = ? WHERE id = ?').run(progress, q.id);
      if (progress >= q.target) {
        db.prepare("UPDATE quests SET status = 'completed', completed_at = ? WHERE id = ?").run(now(), q.id);
        addExperience(q.xp_reward, 'quest');
        addCurrency(q.currency_reward);
        logActivity('quest', `Quest complete: ${q.title}`, q.description, q.xp_reward, q.currency_reward);
      }
    }
  }
}

export function resetDailyQuests() {
  const activeDaily = db.prepare("SELECT COUNT(*) as c FROM quests WHERE type = 'daily' AND status = 'active'").get().c;
  if (activeDaily > 0) return;
  // re-activate completed dailies
  db.prepare("UPDATE quests SET status = 'active', progress = 0, completed_at = NULL WHERE type = 'daily'").run();
}

export function completeMeditation(data) {
  const id = uuidv4();
  const ts = now();
  db.prepare(`
    INSERT INTO meditation_sessions (id, meditation_id, meditation_name, duration_minutes, completed, notes, created_at)
    VALUES (?, ?, ?, ?, 1, ?, ?)
  `).run(id, data.meditationId, data.meditationName, data.durationMinutes, data.notes || '', ts);

  const user = getUser();
  let streak = user.meditation.streak || 0;
  let last = user.meditation.lastMeditated || '';
  const t = today();
  const completed = [...(user.meditation.completedMeditations || [])];

  if (last !== t) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (last === yStr) streak += 1;
    else streak = 1;
    last = t;
    if (!completed.includes(t)) completed.push(t);
  }

  const unlocked = streak >= 7 || user.meditation.unlockedSecretMeditation;

  updateUserFields({
    meditationStreak: streak,
    lastMeditated: last,
    completedMeditations: JSON.stringify(completed),
    unlockedSecretMeditation: unlocked,
  });

  const xp = Math.max(5, data.durationMinutes);
  addExperience(xp, 'meditation');
  addSkillXp('skill3', Math.ceil(data.durationMinutes / 2));
  bumpDailyStats('meditations', 1);
  bumpDailyStats('meditation_minutes', data.durationMinutes);
  bumpQuestProgress('daily', 'meditation');

  const sessionCount = db.prepare('SELECT COUNT(*) as c FROM meditation_sessions').get().c;
  checkAchievementProgress('ach8', sessionCount);

  logActivity('meditation', `Meditated: ${data.meditationName}`, `${data.durationMinutes} minutes`, xp, 0);
  return { streak, unlocked, user: getUser() };
}

export function getMeditationSessions(limit = 50) {
  return db
    .prepare('SELECT * FROM meditation_sessions ORDER BY created_at DESC LIMIT ?')
    .all(limit)
    .map((s) => ({
      id: s.id,
      meditationId: s.meditation_id,
      meditationName: s.meditation_name,
      durationMinutes: s.duration_minutes,
      completed: !!s.completed,
      notes: s.notes,
      createdAt: s.created_at,
    }));
}

export function getJournalEntries() {
  return db
    .prepare('SELECT * FROM journal_entries ORDER BY created_at DESC')
    .all()
    .map((e) => ({
      id: e.id,
      title: e.title,
      content: e.content,
      mood: e.mood,
      tags: JSON.parse(e.tags || '[]'),
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
}

export function createJournalEntry(data) {
  const id = uuidv4();
  const ts = now();
  db.prepare(`
    INSERT INTO journal_entries (id, title, content, mood, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.title || '', data.content, data.mood ?? 3, JSON.stringify(data.tags || []), ts, ts);

  const count = db.prepare('SELECT COUNT(*) as c FROM journal_entries').get().c;
  checkAchievementProgress('ach11', count);
  logActivity('journal', data.title || 'Journal entry', data.content.slice(0, 80), 3, 0);
  addExperience(3, 'journal');
  return getJournalEntries().find((e) => e.id === id);
}

export function updateJournalEntry(id, data) {
  db.prepare(`
    UPDATE journal_entries SET title = COALESCE(?, title), content = COALESCE(?, content),
    mood = COALESCE(?, mood), tags = COALESCE(?, tags), updated_at = ? WHERE id = ?
  `).run(
    data.title ?? null,
    data.content ?? null,
    data.mood ?? null,
    data.tags ? JSON.stringify(data.tags) : null,
    now(),
    id
  );
  return getJournalEntries().find((e) => e.id === id);
}

export function deleteJournalEntry(id) {
  db.prepare('DELETE FROM journal_entries WHERE id = ?').run(id);
  return true;
}

export function getInventory() {
  return db
    .prepare('SELECT * FROM inventory_items WHERE quantity > 0 ORDER BY rarity, name')
    .all()
    .map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      type: i.type,
      rarity: i.rarity,
      icon: i.icon,
      quantity: i.quantity,
      effect: JSON.parse(i.effect || '{}'),
      obtainedAt: i.obtained_at,
    }));
}

export function useInventoryItem(id) {
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);
  if (!item || item.quantity < 1) return { error: 'Item not available' };

  const effect = JSON.parse(item.effect || '{}');
  if (effect.xp) addExperience(effect.xp, 'item');
  if (effect.currency) addCurrency(effect.currency);
  if (effect.focus || effect.endurance || effect.strength || effect.intelligence || effect.charisma) {
    const user = getUser();
    const updates = {};
    for (const stat of ['focus', 'endurance', 'strength', 'intelligence', 'charisma']) {
      if (effect[stat]) updates[stat] = user.stats[stat] + effect[stat];
    }
    updateUserFields(updates);
  }

  db.prepare('UPDATE inventory_items SET quantity = quantity - 1 WHERE id = ?').run(id);
  logActivity('item_used', `Used ${item.name}`, item.description, effect.xp || 0, effect.currency || 0);
  return { item: getInventory().find((i) => i.id === id) || null, user: getUser() };
}

export function getActivityLog(limit = 50) {
  return db
    .prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?')
    .all(limit)
    .map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      xpGained: a.xp_gained,
      currencyGained: a.currency_gained,
      meta: a.meta ? JSON.parse(a.meta) : null,
      createdAt: a.created_at,
    }));
}

export function getDailyStats(days = 14) {
  return db
    .prepare('SELECT * FROM daily_stats ORDER BY date DESC LIMIT ?')
    .all(days)
    .reverse();
}

export function getStatsSummary() {
  const user = getUser();
  const tasks = getTasks();
  const skills = getSkills();
  const achievements = getAchievements();
  const daily = getDailyStats(30);
  const habits = getHabits();

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const avgSkill =
    skills.length > 0 ? Math.round((skills.reduce((s, sk) => s + sk.level, 0) / skills.length) * 10) / 10 : 0;

  // Build weekly data from daily_stats (last 7 days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    weeklyMap[key] = {
      name: days[d.getDay()],
      date: key,
      tasks: 0,
      xp: 0,
      meditations: 0,
    };
  }
  for (const row of daily) {
    if (weeklyMap[row.date]) {
      weeklyMap[row.date].tasks = row.tasks_completed;
      weeklyMap[row.date].xp = row.xp_gained;
      weeklyMap[row.date].meditations = row.meditations;
    }
  }

  const skillData = skills.map((skill, i) => ({
    name: skill.name,
    value: skill.level * 10 + skill.experience / 2,
    level: skill.level,
    color: ['#8B5CF6', '#6E59A5', '#D946EF', '#0EA5E9', '#F97316', '#22C55E', '#EAB308'][i % 7],
  }));

  // Monthly-ish progress from daily stats grouped
  const progressData = daily.slice(-30).map((d) => ({
    name: d.date.slice(5),
    xp: d.xp_gained,
    tasks: d.tasks_completed,
  }));

  const categoryBreakdown = getCategories().map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat.id);
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      total: catTasks.length,
      completed: catTasks.filter((t) => t.completed).length,
    };
  });

  return {
    user,
    overview: {
      completed,
      pending,
      completionRate,
      avgSkillLevel: avgSkill,
      achievementsUnlocked: achievements.filter((a) => a.completed).length,
      achievementsTotal: achievements.length,
      habitCount: habits.length,
      currentStreak: user?.totals?.currentStreak || 0,
      longestStreak: user?.totals?.longestStreak || 0,
      totalXp: user?.totals?.totalXpEarned || 0,
      currency: user?.currency || 0,
    },
    weeklyData: Object.values(weeklyMap),
    skillData,
    progressData,
    categoryBreakdown,
    daily,
  };
}

export function getChatMessages() {
  return db
    .prepare('SELECT * FROM chat_messages ORDER BY created_at ASC')
    .all()
    .map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.created_at,
      isError: !!m.is_error,
    }));
}

export function saveChatMessage(msg) {
  const id = msg.id || uuidv4();
  db.prepare(
    'INSERT INTO chat_messages (id, role, content, is_error, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, msg.role, msg.content, msg.isError ? 1 : 0, msg.timestamp || now());
  return id;
}

export function clearChatMessages() {
  db.prepare('DELETE FROM chat_messages').run();
}

export function exportAllData() {
  return {
    version: 2,
    exportedAt: now(),
    user: getUser(),
    tasks: getTasks(),
    skills: getSkills(),
    achievements: getAchievements(),
    categories: getCategories(),
    rewards: getRewards(),
    habits: getHabits(),
    quests: getQuests(),
    journal: getJournalEntries(),
    inventory: getInventory(),
    activity: getActivityLog(500),
    dailyStats: getDailyStats(365),
    meditations: getMeditationSessions(500),
  };
}

export function importAllData(payload) {
  const tx = db.transaction(() => {
    // Clear and re-insert core tables carefully
    if (payload.user) {
      const u = payload.user;
      updateUserFields({
        name: u.name,
        rank: u.rank,
        level: u.level,
        experience: u.experience,
        nextLevelExperience: u.nextLevelExperience,
        currency: u.currency,
        strength: u.stats?.strength,
        intelligence: u.stats?.intelligence,
        charisma: u.stats?.charisma,
        endurance: u.stats?.endurance,
        focus: u.stats?.focus,
        totalXpEarned: u.totals?.totalXpEarned,
        tasksCompleted: u.totals?.tasksCompleted,
        currentStreak: u.totals?.currentStreak,
        longestStreak: u.totals?.longestStreak,
        lastActiveDate: u.totals?.lastActiveDate,
        meditationStreak: u.meditation?.streak,
        lastMeditated: u.meditation?.lastMeditated,
        completedMeditations: JSON.stringify(u.meditation?.completedMeditations || []),
        unlockedSecretMeditation: u.meditation?.unlockedSecretMeditation,
      });
    }
    if (Array.isArray(payload.tasks)) {
      db.prepare('DELETE FROM tasks').run();
      for (const t of payload.tasks) {
        createTask(t);
        if (t.completed) {
          db.prepare('UPDATE tasks SET completed = 1, completed_at = ? WHERE id = ?').run(
            t.completedAt || now(),
            t.id
          );
        }
      }
    }
  });
  tx();
  return true;
}

export function resetAllData() {
  const tables = [
    'activity_log',
    'daily_stats',
    'meditation_sessions',
    'chat_messages',
    'habit_logs',
    'habits',
    'journal_entries',
    'inventory_items',
    'quests',
    'tasks',
    'rewards',
    'achievements',
    'skills',
    'categories',
    'users',
    'meta',
  ];
  for (const t of tables) {
    try {
      db.prepare(`DELETE FROM ${t}`).run();
    } catch {
      /* ignore */
    }
  }
  seedIfEmpty();
  return true;
}

export function getFullState() {
  resetDailyQuests();
  const user = getUser();
  return {
    user,
    tasks: getTasks(),
    skills: getSkills(),
    achievements: getAchievements(),
    categories: getCategories(),
    rewards: getRewards(),
    habits: getHabits(),
    quests: getQuests(),
    journal: getJournalEntries(),
    inventory: getInventory(),
    activity: getActivityLog(30),
    meditations: getMeditationSessions(20),
    stats: getStatsSummary(),
  };
}

// Initialize
initSchema();
seedIfEmpty();

export default db;
