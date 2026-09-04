import React, { useMemo, useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/services/api';

const Tasks = () => {
  const { state, completeTask, createTask, updateTask, deleteTask } = useApp();
  const tasks = state?.tasks || [];
  const categories = state?.categories || [];
  const skills = state?.skills || [];

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    xpReward: '10',
    currencyReward: '1',
    category: '',
    skillId: '',
    priority: 'medium',
    difficulty: 'normal',
    recurring: false,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(task.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [tasks, filter, searchQuery, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      xpReward: '10',
      currencyReward: '1',
      category: categories[0]?.id || '',
      skillId: '',
      priority: 'medium',
      difficulty: 'normal',
      recurring: false,
    });
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || '',
      xpReward: String(task.xpReward ?? 10),
      currencyReward: String(task.currencyReward ?? 1),
      category: task.category || '',
      skillId: task.skillId || '',
      priority: task.priority || 'medium',
      difficulty: task.difficulty || 'normal',
      recurring: !!task.recurring,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      xpReward: Number(form.xpReward) || 10,
      currencyReward: Number(form.currencyReward) || 1,
      category: form.category || undefined,
      skillId: form.skillId || undefined,
      priority: form.priority,
      difficulty: form.difficulty,
      recurring: form.recurring,
      recurringType: form.recurring ? 'daily' : undefined,
    };
    if (editing) {
      await updateTask(editing.id, payload);
    } else {
      await createTask(payload);
    }
    setShowForm(false);
  };

  const catName = (id?: string) => categories.find((c) => c.id === id)?.name;
  const catColor = (id?: string) => categories.find((c) => c.id === id)?.color;

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Your Quests
          </h1>
          <div className="text-sm text-solo-secondary">
            {tasks.filter((t) => !t.completed).length} pending
          </div>
        </div>

        <div className="relative mb-4 animate-fade-in">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-solo-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search quests..."
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-solo-accent/50 placeholder-solo-secondary/50 text-solo-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-5 w-5 text-solo-secondary hover:text-solo-text" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 animate-fade-in">
          <button
            className={cn(
              'px-3 py-1.5 text-xs rounded-full border shrink-0',
              categoryFilter === 'all'
                ? 'border-solo-accent text-solo-accent bg-solo-accent/10'
                : 'border-white/10 text-solo-secondary'
            )}
            onClick={() => setCategoryFilter('all')}
          >
            <Filter className="h-3 w-3 inline mr-1" />
            All cats
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full border shrink-0',
                categoryFilter === c.id
                  ? 'border-solo-accent text-solo-accent bg-solo-accent/10'
                  : 'border-white/10 text-solo-secondary'
              )}
              onClick={() => setCategoryFilter(c.id)}
              style={categoryFilter === c.id ? { borderColor: c.color, color: c.color } : undefined}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex mb-6 border-b border-white/10 animate-fade-in">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize',
                filter === f
                  ? 'border-solo-accent text-solo-accent'
                  : 'border-transparent text-solo-secondary hover:text-solo-text'
              )}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4 animate-scale-in">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <GlassCard
                key={task.id}
                className={cn(
                  'transition-all duration-300 cursor-pointer',
                  task.completed
                    ? 'bg-opacity-5 border-solo-highlight/20'
                    : 'hover:border-solo-accent/30'
                )}
                onClick={() => openEdit(task)}
              >
                <div className="flex items-start">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      'h-8 w-8 rounded-full mr-3 border shrink-0 mt-1',
                      task.completed
                        ? 'bg-solo-highlight/20 border-solo-highlight text-solo-highlight'
                        : 'bg-transparent border-white/10 text-white/30 hover:text-white hover:border-white/30'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      completeTask(task.id, !task.completed);
                    }}
                  >
                    {task.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-white/30" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'font-medium transition-all text-lg',
                        task.completed && 'line-through text-solo-secondary'
                      )}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div
                        className={cn(
                          'text-sm mt-1',
                          task.completed ? 'text-solo-secondary/50' : 'text-solo-secondary'
                        )}
                      >
                        {task.description}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center mt-2 gap-2">
                      <div
                        className={cn(
                          'text-xs py-1 px-2 rounded-full',
                          task.completed
                            ? 'bg-solo-highlight/20 text-solo-highlight'
                            : 'bg-solo-accent/20 text-solo-accent'
                        )}
                      >
                        +{task.xpReward} XP
                      </div>
                      {task.priority === 'high' && (
                        <div className="text-xs py-1 px-2 rounded-full bg-red-500/20 text-red-300">
                          High
                        </div>
                      )}
                      {task.recurring && (
                        <div className="text-xs py-1 px-2 rounded-full bg-solo-accent/10 text-solo-secondary">
                          Recurring
                        </div>
                      )}
                      {task.category && (
                        <div
                          className="text-xs py-1 px-2 rounded-full"
                          style={{
                            backgroundColor: `${catColor(task.category)}22`,
                            color: catColor(task.category),
                          }}
                        >
                          {catName(task.category)}
                        </div>
                      )}
                      <div className="text-xs text-solo-secondary ml-auto">
                        {new Date(task.date).toLocaleDateString()}
                      </div>
                      <button
                        className="text-solo-secondary/40 hover:text-red-400 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-solo-secondary mb-2">No quests found</div>
              <p className="text-sm text-solo-secondary/70">
                {searchQuery ? 'Try adjusting your search' : 'Add a new quest to get started'}
              </p>
            </div>
          )}
        </div>

        <FloatingActionButton
          onClick={openCreate}
          className="bg-gradient-to-r from-solo-accent to-solo-highlight hover:from-solo-highlight hover:to-solo-accent text-white"
        />
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-solo-card border-white/10 text-solo-text max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Quest' : 'New Quest'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Quest title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="bg-black/20 border-white/10"
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="bg-black/20 border-white/10"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-solo-secondary">XP Reward</label>
                <Input
                  type="number"
                  value={form.xpReward}
                  onChange={(e) => setForm((f) => ({ ...f, xpReward: e.target.value }))}
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-solo-secondary">Coins</label>
                <Input
                  type="number"
                  value={form.currencyReward}
                  onChange={(e) => setForm((f) => ({ ...f, currencyReward: e.target.value }))}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-solo-secondary">Priority</label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
                >
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-solo-secondary">Difficulty</label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}
                >
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-solo-secondary">Category</label>
              <Select
                value={form.category || 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v === 'none' ? '' : v }))}
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-solo-secondary">Linked Skill</label>
              <Select
                value={form.skillId || 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, skillId: v === 'none' ? '' : v }))}
              >
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {skills.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.recurring}
                onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.checked }))}
                className="rounded"
              />
              Recurring daily quest
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button className="bg-solo-accent" onClick={handleSave} disabled={!form.title.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavBar />
    </div>
  );
};

export default Tasks;
