
import React from 'react';
import GlassCard from '../ui/glass-card';
import { ListTodo, Plus, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { updateTask, getTasks, setTasks, addExperience } from '@/services/storageService';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface DailyTasksProps {
  tasks: Task[];
  className?: string;
}

const DailyTasks = ({ tasks: initialTasks, className }: DailyTasksProps) => {
  const [tasks, setTasksState] = React.useState<Task[]>(initialTasks);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Load tasks from storage on mount to ensure we have the latest data
  React.useEffect(() => {
    const storedTasks = getTasks();
    if (storedTasks.length > 0) {
      setTasksState(storedTasks);
    }
  }, []);

  const toggleTaskCompletion = (taskId: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    
    // Update task in local state
    const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
    setTasksState(updatedTasks);
    
    // Update task in localStorage
    updateTask(taskId, { completed: updatedTask.completed });
    
    // Award XP if task is being completed
    if (updatedTask.completed) {
      addExperience(updatedTask.xpReward);
      toast.success("Task completed!", {
        description: `You earned +${updatedTask.xpReward} XP.`,
      });
    } else {
      toast.info("Task marked as incomplete", {
        description: "Task status updated.",
      });
    }
  };

  const openDeleteDialog = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent task toggling when clicking delete button
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    
    // Update local state
    const updatedTasks = tasks.filter(t => t.id !== taskToDelete);
    setTasksState(updatedTasks);
    
    // Update localStorage
    const allTasks = getTasks();
    const filteredTasks = allTasks.filter(t => t.id !== taskToDelete);
    setTasks(filteredTasks);
    
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
    
    toast.success("Task deleted", {
      description: "The task has been removed from your quests.",
    });
  };

  const addNewTask = () => {
    // Create a new simple task
    const newTask: Task = {
      id: uuidv4(),
      title: "New Quest",
      description: "Click to edit this quest",
      completed: false,
      date: new Date().toISOString(),
      recurring: false,
      xpReward: 10,
      createdAt: new Date().toISOString()
    };
    
    // Update local state
    const updatedTasks = [...tasks, newTask];
    setTasksState(updatedTasks);
    
    // Update localStorage
    const allTasks = getTasks();
    setTasks([...allTasks, newTask]);
    
    toast.success("New quest created", {
      description: "Edit the quest to customize it.",
    });
  };

  return (
    <GlassCard className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ListTodo className="h-5 w-5 text-solo-accent mr-2" />
          <h2 className="text-lg font-bold">Today's Quests</h2>
        </div>
        <span className="text-sm text-solo-secondary">
          {tasks.filter(t => t.completed).length}/{tasks.length} completed
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={cn(
              "p-3 rounded-lg border flex items-center transition-all duration-300 group",
              task.completed 
                ? "bg-solo-highlight/10 border-solo-highlight/30" 
                : "bg-black/20 border-white/5 hover:border-solo-accent/30"
            )}
          >
            <Button 
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 rounded-full mr-3 border",
                task.completed 
                  ? "bg-solo-highlight/20 border-solo-highlight text-solo-highlight" 
                  : "bg-transparent border-white/10 text-white/30 hover:text-white hover:border-white/30"
              )}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.completed ? (
                <div className="h-3 w-3 rounded-full bg-solo-highlight" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-white/30" />
              )}
            </Button>
            
            <div className="flex-1">
              <div className={cn(
                "font-medium transition-all",
                task.completed && "line-through text-solo-secondary"
              )}>
                {task.title}
              </div>
              {task.description && (
                <div className="text-xs text-solo-secondary mt-1">
                  {task.description}
                </div>
              )}
            </div>
            
            <div className={cn(
              "text-xs py-1 px-2 rounded-full ml-2",
              task.completed 
                ? "bg-solo-highlight/20 text-solo-highlight" 
                : "bg-solo-accent/20 text-solo-accent"
            )}>
              +{task.xpReward} XP
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-solo-secondary hover:text-red-500 hover:bg-red-500/10"
              onClick={(e) => openDeleteDialog(task.id, e)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full mt-2 border border-dashed border-white/10 hover:border-solo-accent/30 hover:bg-black/10"
          onClick={addNewTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Quest
        </Button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-sm border-white/10">
          <DialogHeader>
            <DialogTitle className="text-solo-text">Delete Quest</DialogTitle>
            <DialogDescription className="text-solo-secondary">
              Are you sure you want to delete this quest? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-solo-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTask}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default DailyTasks;
