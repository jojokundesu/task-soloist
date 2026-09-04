import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getFullState,
  getUser,
  updateUserFields,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSkills,
  getAchievements,
  getCategories,
  getRewards,
  claimReward,
  createReward,
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
  getQuests,
  completeMeditation,
  getMeditationSessions,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getInventory,
  useInventoryItem,
  getActivityLog,
  getStatsSummary,
  getChatMessages,
  saveChatMessage,
  clearChatMessages,
  exportAllData,
  importAllData,
  resetAllData,
  addExperience,
  addCurrency,
} from './db.js';
import { generateBeruReply } from './beruEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Request logging (lightweight)
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  }
  next();
});

// ---------- API ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, offline: true, time: new Date().toISOString() });
});

app.get('/api/state', (_req, res) => {
  try {
    res.json(getFullState());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/user', (_req, res) => res.json(getUser()));

app.patch('/api/user', (req, res) => {
  try {
    const body = req.body || {};
    const flat = { ...body };
    if (body.stats) {
      Object.assign(flat, body.stats);
      delete flat.stats;
    }
    if (body.profile) {
      Object.assign(flat, body.profile);
      delete flat.profile;
    }
    if (body.meditation) {
      if (body.meditation.streak !== undefined) flat.meditationStreak = body.meditation.streak;
      if (body.meditation.lastMeditated !== undefined) flat.lastMeditated = body.meditation.lastMeditated;
      if (body.meditation.completedMeditations)
        flat.completedMeditations = JSON.stringify(body.meditation.completedMeditations);
      if (body.meditation.unlockedSecretMeditation !== undefined)
        flat.unlockedSecretMeditation = body.meditation.unlockedSecretMeditation;
      delete flat.meditation;
    }
    res.json(updateUserFields(flat));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/user/onboarding', (req, res) => {
  try {
    const { name, age, height, weight, bodyFatPercentage, intelligenceLevel, strengthLevel } = req.body || {};
    const user = updateUserFields({
      name: name || 'Shadow Monarch',
      age: Number(age) || 25,
      height: Number(height) || 175,
      weight: Number(weight) || 70,
      bodyFatPercentage: Number(bodyFatPercentage) || 15,
      strength: Math.max(5, Math.min(15, (Number(strengthLevel) || 5) + 5)),
      intelligence: Math.max(5, Math.min(15, (Number(intelligenceLevel) || 5) + 5)),
      endurance: Number(bodyFatPercentage) > 25 ? 8 : 10,
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Tasks
app.get('/api/tasks', (req, res) => {
  res.json(
    getTasks({
      completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      date: req.query.date,
      categoryId: req.query.category,
      search: req.query.q,
    })
  );
});

app.post('/api/tasks', (req, res) => {
  try {
    res.status(201).json(createTask(req.body || {}));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const task = updateTask(req.params.id, req.body || {});
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task, state: getFullState() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  deleteTask(req.params.id);
  res.json({ ok: true });
});

app.get('/api/skills', (_req, res) => res.json(getSkills()));
app.get('/api/achievements', (_req, res) => res.json(getAchievements()));
app.get('/api/categories', (_req, res) => res.json(getCategories()));

// Rewards
app.get('/api/rewards', (_req, res) => res.json(getRewards()));
app.post('/api/rewards', (req, res) => res.status(201).json(createReward(req.body || {})));
app.post('/api/rewards/:id/claim', (req, res) => {
  const result = claimReward(req.params.id);
  if (result.error) return res.status(400).json(result);
  res.json({ ...result, state: getFullState() });
});

// Habits
app.get('/api/habits', (_req, res) => res.json(getHabits()));
app.post('/api/habits', (req, res) => res.status(201).json(createHabit(req.body || {})));
app.post('/api/habits/:id/toggle', (req, res) => {
  const habit = toggleHabit(req.params.id, req.body?.date);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json({ habit, state: getFullState() });
});
app.delete('/api/habits/:id', (req, res) => {
  deleteHabit(req.params.id);
  res.json({ ok: true });
});

// Quests
app.get('/api/quests', (_req, res) => res.json(getQuests()));

// Meditation
app.get('/api/meditations/sessions', (_req, res) => res.json(getMeditationSessions()));
app.post('/api/meditations/complete', (req, res) => {
  try {
    const result = completeMeditation(req.body || {});
    res.json({ ...result, state: getFullState() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Journal
app.get('/api/journal', (_req, res) => res.json(getJournalEntries()));
app.post('/api/journal', (req, res) => {
  if (!req.body?.content) return res.status(400).json({ error: 'Content required' });
  res.status(201).json(createJournalEntry(req.body));
});
app.patch('/api/journal/:id', (req, res) => res.json(updateJournalEntry(req.params.id, req.body || {})));
app.delete('/api/journal/:id', (req, res) => {
  deleteJournalEntry(req.params.id);
  res.json({ ok: true });
});

// Inventory
app.get('/api/inventory', (_req, res) => res.json(getInventory()));
app.post('/api/inventory/:id/use', (req, res) => {
  const result = useInventoryItem(req.params.id);
  if (result.error) return res.status(400).json(result);
  res.json({ ...result, state: getFullState() });
});

// Activity & stats
app.get('/api/activity', (req, res) => res.json(getActivityLog(Number(req.query.limit) || 50)));
app.get('/api/stats', (_req, res) => res.json(getStatsSummary()));

// Chat (offline Beru)
app.get('/api/chat', (_req, res) => {
  let messages = getChatMessages();
  if (messages.length === 0) {
    const welcome = {
      id: 'welcome',
      role: 'assistant',
      content:
        'Greetings, my Liege! I am Beru, your loyal servant. I run entirely offline within this System. Ask about your status, quests, meditation, habits, or how to grow stronger!',
      timestamp: new Date().toISOString(),
    };
    saveChatMessage(welcome);
    messages = [welcome];
  }
  res.json(messages);
});

app.post('/api/chat', (req, res) => {
  try {
    const content = (req.body?.content || '').trim();
    if (!content) return res.status(400).json({ error: 'Message required' });

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    saveChatMessage(userMsg);

    const state = getFullState();
    const history = getChatMessages();
    const reply = generateBeruReply(content, state, history);

    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    };
    saveChatMessage(assistantMsg);

    res.json({ messages: [userMsg, assistantMsg], reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/chat', (_req, res) => {
  clearChatMessages();
  res.json({ ok: true });
});

// XP / currency manual (debug / admin)
app.post('/api/xp', (req, res) => {
  const amount = Number(req.body?.amount) || 0;
  res.json(addExperience(amount, 'manual'));
});
app.post('/api/currency', (req, res) => {
  const amount = Number(req.body?.amount) || 0;
  res.json(addCurrency(amount));
});

// Backup / restore / reset
app.get('/api/export', (_req, res) => {
  const data = exportAllData();
  res.setHeader('Content-Disposition', 'attachment; filename="task-soloist-backup.json"');
  res.json(data);
});

app.post('/api/import', (req, res) => {
  try {
    importAllData(req.body || {});
    res.json(getFullState());
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/reset', (_req, res) => {
  resetAllData();
  res.json(getFullState());
});

// Production: serve built frontend
const distPath = path.join(__dirname, '..', 'dist');
if (isProd && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Task Soloist API running on http://0.0.0.0:${PORT}`);
  console.log(`Mode: ${isProd ? 'production' : 'development'} · fully offline capable`);
});
