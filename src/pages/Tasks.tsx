
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { tasks as initialTasks, categories } from '@/data/mockData';
import { Task } from '@/types';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Check, Clock as ClockIcon, Filter, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { getTasks, setTasks, updateTask, addExperience } from '@/services/storageService';
import { v4 as uuidv4 } from 'uuid';

const Tasks = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasksState] = useState<Task[]>([]);
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = getTasks();
    if (storedTasks.length > 0) {
      setTasksState(storedTasks);
    } else {
      // Initialize with default tasks if none exist
      setTasks(initialTasks);
      setTasksState(initialTasks);
    }
  }, []);
  
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    
    // Filter by search
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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

  // Function to add a new task
  const addNewTask = () => {
    // This would normally open a form, but for now just create a dummy task
    const newTask: Task = {
      id: uuidv4(),
      title: "New Task",
      description: "Click to edit this task",
      completed: false,
      date: new Date().toISOString(),
      recurring: false,
      xpReward: 10,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasksState(updatedTasks);
    setTasks(updatedTasks);
    
    toast.success("New task created", {
      description: "Edit the task to customize it.",
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Your Quests
          </h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-solo-highlight/30 hover:bg-solo-highlight/10 text-solo-highlight"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-solo-accent/30 hover:bg-solo-accent/10 text-solo-accent"
            >
              <ClockIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">History</span>
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-in">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-solo-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search quests..."
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-solo-accent/50 focus:border-transparent placeholder-solo-secondary/50 text-solo-text"
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
        
        {/* Filter Tabs */}
        <div className="flex mb-6 border-b border-white/10 animate-fade-in">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'all' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'pending' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === 'completed' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        {/* Tasks List */}
        <div className="space-y-4 animate-scale-in">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={toggleTaskCompletion} 
              />
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-solo-secondary mb-2">No quests found</div>
              <p className="text-sm text-solo-secondary/70">
                {searchQuery 
                  ? "Try adjusting your search parameters" 
                  : "Add a new quest to get started"}
              </p>
            </div>
          )}
        </div>
        
        {/* Add Task Button */}
        <FloatingActionButton 
          onClick={addNewTask} 
          className="bg-gradient-to-r from-solo-accent to-solo-highlight hover:from-solo-highlight hover:to-solo-accent text-white"
        />
      </div>
      
      <NavBar />
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

const TaskItem = ({ task, onToggle }: TaskItemProps) => {
  return (
    <GlassCard className={cn(
      "transition-all duration-300",
      task.completed
        ? "bg-opacity-5 border-solo-highlight/20"
        : "hover:border-solo-accent/30"
    )}>
      <div className="flex items-start">
        <Button 
          size="icon"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-full mr-3 border shrink-0 mt-1",
            task.completed 
              ? "bg-solo-highlight/20 border-solo-highlight text-solo-highlight" 
              : "bg-transparent border-white/10 text-white/30 hover:text-white hover:border-white/30"
          )}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? (
            <Check className="h-4 w-4" />
          ) : (
            <div className="h-3 w-3 rounded-full border border-white/30" />
          )}
        </Button>
        
        <div className="flex-1">
          <div className={cn(
            "font-medium transition-all text-lg",
            task.completed && "line-through text-solo-secondary"
          )}>
            {task.title}
          </div>
          
          {task.description && (
            <div className={cn(
              "text-sm mt-1",
              task.completed ? "text-solo-secondary/50" : "text-solo-secondary"
            )}>
              {task.description}
            </div>
          )}
          
          <div className="flex items-center mt-2 space-x-2">
            <div className={cn(
              "text-xs py-1 px-2 rounded-full",
              task.completed 
                ? "bg-solo-highlight/20 text-solo-highlight" 
                : "bg-solo-accent/20 text-solo-accent"
            )}>
              +{task.xpReward} XP
            </div>
            
            {task.recurring && (
              <div className="text-xs py-1 px-2 rounded-full bg-solo-accent/10 text-solo-secondary">
                Recurring
              </div>
            )}
            
            <div className="text-xs text-solo-secondary ml-auto">
              {new Date(task.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default Tasks;
