import React, { useState } from 'react';
import GlassCard from '../ui/glass-card';
import { ListTodo, Plus, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';

interface DailyTasksProps {
  tasks: Task[];
  className?: string;
}

const DailyTasks = ({ tasks: initialTasks, className }: DailyTasksProps) => {
  const { state, completeTask, createTask, deleteTask } = useApp();
  const tasks = (state?.tasks || initialTasks).filter((t) => !t.completed).slice(0, 6);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');

  const openDeleteDialog = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      description: '',
      xpReward: 10,
      currencyReward: 1,
      recurring: false,
    });
    setTitle('');
    setShowAdd(false);
  };

  return (
    <GlassCard className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ListTodo className="h-5 w-5 mr-2 text-solo-accent" />
          <h2 className="text-lg font-semibold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Daily Quests
          </h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-solo-accent hover:bg-solo-accent/10"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && (
          <p className="text-sm text-solo-secondary text-center py-4">
            All quests complete. Create a new one!
          </p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-solo-accent/30 transition-all cursor-pointer group'
            )}
            onClick={() => completeTask(task.id, true)}
          >
            <div className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:border-solo-accent">
              <div className="h-2.5 w-2.5 rounded-full border border-white/30" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{task.title}</div>
              <div className="text-xs text-solo-accent">+{task.xpReward} XP</div>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 text-solo-secondary hover:text-red-400 p-1"
              onClick={(e) => openDeleteDialog(task.id, e)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-solo-card border-white/10 text-solo-text">
          <DialogHeader>
            <DialogTitle>Delete Quest?</DialogTitle>
            <DialogDescription className="text-solo-secondary">
              This quest will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-solo-card border-white/10 text-solo-text">
          <DialogHeader>
            <DialogTitle>Quick Quest</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Quest title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/20 border-white/10"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button className="bg-solo-accent" onClick={handleAdd} disabled={!title.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default DailyTasks;
