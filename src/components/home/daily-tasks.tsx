
import React from 'react';
import GlassCard from '../ui/glass-card';
import { ListTodo, Plus } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DailyTasksProps {
  tasks: Task[];
  className?: string;
}

const DailyTasks = ({ tasks, className }: DailyTasksProps) => {
  const toggleTaskCompletion = (taskId: string) => {
    toast.success("Task status updated", {
      description: "Your XP has been updated accordingly.",
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
          </div>
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full mt-2 border border-dashed border-white/10 hover:border-solo-accent/30 hover:bg-black/10"
          onClick={() => toast("Task creation not implemented yet")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Quest
        </Button>
      </div>
    </GlassCard>
  );
};

export default DailyTasks;
