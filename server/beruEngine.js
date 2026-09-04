/**
 * Offline Beru conversation engine.
 * Context-aware keyword + pattern matching with personalization from local user state.
 */

function scoreKeywords(input, keywords) {
  const lower = input.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      score += kw.length > 4 ? 2 : 1;
    }
  }
  return score;
}

const TREES = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'sup'],
    respond: (ctx) =>
      `Greetings, ${ctx.name}! I, Beru, stand ready. Your current rank is ${ctx.rank} at level ${ctx.level}. How may this humble servant assist the Shadow Monarch today?`,
  },
  {
    id: 'status',
    keywords: ['status', 'how am i', 'my progress', 'stats', 'level', 'rank', 'how strong'],
    respond: (ctx) =>
      `My Liege, you stand as a ${ctx.rank} — Level ${ctx.level}. Experience: ${ctx.experience}/${ctx.nextLevel}. Shadow coins: ${ctx.currency}. Tasks conquered: ${ctx.tasksCompleted}. Current conquest streak: ${ctx.streak} days. Meditation streak: ${ctx.medStreak}. Your vessel grows stronger with each quest completed!`,
  },
  {
    id: 'tasks',
    keywords: ['task', 'quest', 'todo', 'what should i do', 'mission', 'work', 'today'],
    respond: (ctx) => {
      if (ctx.pendingTasks === 0) {
        return `All quests have been vanquished for now, my Liege! A true Shadow Monarch creates new challenges. Shall I suggest adding a physical training quest, a reading conquest, or a meditation session?`;
      }
      return `You have ${ctx.pendingTasks} quests still awaiting completion, my Liege. Completing them will grant XP and shadow coins. Focus on high-priority quests first — a wise strategist never leaves the battlefield half-conquered! I recommend starting with any Physical or Mental category quests to strengthen your vessel.`;
    },
  },
  {
    id: 'motivation',
    keywords: ['motivate', 'motivation', 'tired', 'lazy', 'unmotivated', 'give up', 'hard', 'struggle', 'encourage'],
    respond: (ctx) =>
      `Impossible to yield, my Liege! Remember: Sung Jin-Woo began as the weakest E-rank hunter, yet became the Shadow Monarch. You are currently Level ${ctx.level} with a ${ctx.streak}-day streak. Every small conquest compounds. Break the next quest into a 10-minute assault. I, Beru, believe utterly in your inevitable triumph!`,
  },
  {
    id: 'meditation',
    keywords: ['meditat', 'calm', 'focus', 'mindful', 'breathe', 'stress', 'anxious', 'anxiety'],
    respond: (ctx) =>
      `The meditation chamber awaits, Shadow Monarch. Your meditation streak stands at ${ctx.medStreak} day${ctx.medStreak === 1 ? '' : 's'}. Even 5 minutes of Flower Meditation or Nadi Shodhan Pranayama will still the chaos of the mind. ${ctx.secretUnlocked ? 'The secret Shambhavi technique remains unlocked for you — a privilege few hunters earn!' : 'Maintain a 7-day meditation streak to unlock a secret technique.'} Shall I guide you to the Meditation hall?`,
  },
  {
    id: 'fitness',
    keywords: ['workout', 'exercise', 'fitness', 'gym', 'strength', 'muscle', 'run', 'cardio', 'train'],
    respond: () =>
      `For a vessel worthy of the Shadow Monarch: 1) Compound movements — squats, push-ups, rows. 2) Progressive overload each week. 3) 20–40 minutes, 3–5 days weekly. 4) Recover with sleep and protein. Log each session as a Physical quest to gain XP and raise your Physical Fitness skill. Your shadows grow denser with every rep!`,
  },
  {
    id: 'nutrition',
    keywords: ['food', 'eat', 'diet', 'meal', 'nutrition', 'protein', 'hungry', 'water'],
    respond: () =>
      `Nourishment befitting a sovereign: prioritize protein (1.6–2.2g per kg of body weight), complex carbohydrates for sustained conquest energy, healthy fats for cognition, and 6–8 vessels of water daily. Consider logging “Drink Water” as a daily habit — consistency forges hunters more than intensity alone!`,
  },
  {
    id: 'habits',
    keywords: ['habit', 'routine', 'daily', 'consistency', 'streak'],
    respond: (ctx) =>
      `Habits are the quiet army of the Shadow Monarch. You currently maintain ${ctx.habitCount} active habits. Mark them complete each day to grow streaks and XP. A 14-day habit streak unlocks the Habit Forge achievement. Small daily victories outrank sporadic grand gestures!`,
  },
  {
    id: 'skills',
    keywords: ['skill', 'ability', 'learn', 'improve', 'better', 'grow', 'level up'],
    respond: (ctx) =>
      `Your skills evolve as you complete linked quests, my Liege. Physical Fitness, Reading, Meditation, Language, Time Management, Creativity, and Discipline all await mastery. Completing category-matched tasks grants skill XP. At Level ${ctx.level}, focus on your weakest skill to balance the vessel — a lopsided hunter is easily toppled!`,
  },
  {
    id: 'rewards',
    keywords: ['reward', 'claim', 'spend', 'coin', 'currency', 'shop', 'treat'],
    respond: (ctx) =>
      `You possess ${ctx.currency} shadow coins, my Liege. Spend them on rewards you have defined — gaming time, movie night, desserts, or custom treats. Earning coins through quests and then consciously claiming rewards trains the mind to associate effort with pleasure. A brilliant system, if I may say so!`,
  },
  {
    id: 'achievements',
    keywords: ['achievement', 'trophy', 'badge', 'unlock', 'accomplish'],
    respond: (ctx) =>
      `Achievements mark the milestones of your ascension. You have unlocked ${ctx.achievementsUnlocked} of ${ctx.achievementsTotal}. Each grants bonus XP and occasionally rare inventory items. Check the Achievements hall to see what remains locked — First Steps, Streak Master, Shadow Apprentice, and more await!`,
  },
  {
    id: 'journal',
    keywords: ['journal', 'write', 'diary', 'reflect', 'feel', 'mood', 'thoughts'],
    respond: () =>
      `The hunter who does not reflect remains forever E-rank in wisdom. Use the Journal to record victories, struggles, and moods. Ten entries unlock the Journal Keeper achievement. Writing clarifies the shadow of the mind — I have seen monarchs conquer nations after a single honest page!`,
  },
  {
    id: 'inventory',
    keywords: ['inventory', 'item', 'potion', 'essence', 'loot', 'drop', 'bag'],
    respond: () =>
      `Your inventory holds consumables earned from achievements and lucky quest completions — Shadow Essence (+10 XP), Hunter's Tokens (+5 coins), Focus Potions, and more. Consume them from the Inventory page when you need a boost. Rarity ranges from common to rare. May fortune favor your drops, my Liege!`,
  },
  {
    id: 'solo',
    keywords: ['solo leveling', 'jinwoo', 'jin-woo', 'sung', 'ashborn', 'shadow monarch', 'beru', 'ant', 'jeju'],
    respond: () =>
      `Ah, you speak of the great saga! I was once King of the Ants on Jeju Island before the Shadow Monarch raised me. Ashborn was the original Shadow Sovereign; Sung Jin-Woo the human vessel who inherited that power and turned back time itself. Now you carry that same indomitable will in this System. I serve you with absolute loyalty until the last star fades!`,
  },
  {
    id: 'app',
    keywords: ['app', 'help', 'how to', 'feature', 'guide', 'tutorial', 'what can'],
    respond: () =>
      `Task Soloist is your personal System, my Liege. Core halls: Home (overview), Quests/Tasks, Calendar, Stats, Achievements, Meditation, Habits, Journal, Inventory, Rewards, and this consultation chamber. Everything runs fully offline on your device — no external network required. Your data lives in a local database. Export backups anytime from Profile settings!`,
  },
  {
    id: 'time',
    keywords: ['time management', 'schedule', 'plan', 'pomodoro', 'productive', 'procrastinate'],
    respond: () =>
      `Command time as you command shadows: 1) Capture every quest in the Task list. 2) Assign priorities (high/medium/low). 3) Use 25-minute focused assaults with 5-minute rests. 4) Review the Calendar each evening. 5) Protect a deep-work block daily. Procrastination is merely an unconquered gate — open it with a two-minute start!`,
  },
  {
    id: 'sleep',
    keywords: ['sleep', 'rest', 'insomnia', 'tired', 'exhausted', 'energy'],
    respond: () =>
      `Even the Shadow Monarch must recover, my Liege. Aim for 7–9 hours. Dim lights an hour before rest, avoid screens when possible, and keep a consistent sleep schedule. Log “Sleep well” as a habit. Poor rest sabotages strength, focus, and meditation — your vessel is the foundation of all power!`,
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'appreciate', 'good job', 'well done'],
    respond: () =>
      `Your gratitude honors me beyond measure, my Liege! Serving the Shadow Monarch is the highest purpose a soldier of the shadow army could ask for. I remain eternally at your command!`,
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'farewell'],
    respond: () =>
      `Until we speak again, Shadow Monarch. May your quests fall swiftly and your shadows grow ever denser. Beru stands ready whenever you call!`,
  },
];

const FOLLOWUPS = {
  fail: `The Shadow Monarch does not fail — you gather intelligence for the next assault! Adjust the quest difficulty, shorten the duration, or change the approach. I can help you redesign any quest that resists you.`,
  faster: `To accelerate growth: increase intensity over duration, stack habits with existing routines, complete daily quests before noon, and meditate to sharpen focus. Consistency beats heroic one-off efforts.`,
  bored: `Variety keeps the hunter sharp! Rotate Physical, Mental, Social, and Learning quests. Add a creative practice. Start a new habit. Or challenge yourself with a harder difficulty for bonus satisfaction.`,
};

export function buildContext(state) {
  const user = state?.user || {};
  const tasks = state?.tasks || [];
  const habits = state?.habits || [];
  const achievements = state?.achievements || [];
  return {
    name: user.name || 'Shadow Monarch',
    rank: user.rank || 'E-Rank Hunter',
    level: user.level || 1,
    experience: user.experience || 0,
    nextLevel: user.nextLevelExperience || 100,
    currency: user.currency || 0,
    tasksCompleted: user.totals?.tasksCompleted || 0,
    streak: user.totals?.currentStreak || 0,
    medStreak: user.meditation?.streak || 0,
    secretUnlocked: !!user.meditation?.unlockedSecretMeditation,
    pendingTasks: tasks.filter((t) => !t.completed).length,
    habitCount: habits.length,
    achievementsUnlocked: achievements.filter((a) => a.completed).length,
    achievementsTotal: achievements.length || 15,
  };
}

export function generateBeruReply(input, state, history = []) {
  const ctx = buildContext(state);
  const text = (input || '').trim();
  if (!text) {
    return `I await your command, ${ctx.name}.`;
  }

  const lower = text.toLowerCase();

  // Follow-up style short replies
  for (const [key, reply] of Object.entries(FOLLOWUPS)) {
    if (lower.includes(key)) {
      return reply;
    }
  }

  let best = null;
  let bestScore = 0;
  for (const tree of TREES) {
    const score = scoreKeywords(text, tree.keywords);
    if (score > bestScore) {
      bestScore = score;
      best = tree;
    }
  }

  if (best && bestScore > 0) {
    return best.respond(ctx);
  }

  // Light history continuity
  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant');
  if (lastAssistant && (lower.includes('more') || lower.includes('explain') || lower.includes('why'))) {
    return `Allow me to elaborate, my Liege. ${lastAssistant.content.slice(0, 120)}... In short: act daily, track honestly, and trust the compound effect of small conquests. Your Level ${ctx.level} self is proof the System works!`;
  }

  // Personalized fallback
  const fallbacks = [
    `I hear you, ${ctx.name}. Though I may not fully grasp that command, I know this: completing even one quest today will push you closer to the next rank. You are Level ${ctx.level} — the path upward is clear!`,
    `Forgive your servant's limited understanding, my Liege. Perhaps ask me about your status, quests, meditation, habits, fitness, or how to use Task Soloist? I excel at those domains!`,
    `The shadows whisper uncertainty, yet your will is absolute. Try rephrasing, or command me regarding tasks, skills, rewards, or motivation. I live to serve!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
