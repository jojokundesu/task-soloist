import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const Calendar = () => {
  const { state, completeTask } = useApp();
  const allTasks = state?.tasks || [];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const getTasksForDate = (date: Date) => {
    return allTasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const getCompletedTasksCount = (date: Date) => {
    return getTasksForDate(date).filter((task) => task.completed).length;
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-14 bg-black/10 rounded-lg opacity-30" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const dateTasks = getTasksForDate(date);
      const dateHasTasks = dateTasks.length > 0;
      const completedTasksCount = getCompletedTasksCount(date);
      const allTasksCompleted = dateHasTasks && completedTasksCount === dateTasks.length;

      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            'h-14 rounded-lg flex flex-col justify-between p-2 cursor-pointer transition-all duration-200',
            isSelected
              ? 'bg-solo-accent/30 border-2 border-solo-accent'
              : isToday
                ? 'bg-solo-highlight/20 border border-solo-highlight/30'
                : dateHasTasks
                  ? 'bg-black/20 border border-white/10 hover:border-solo-accent/30'
                  : 'bg-black/10 border border-transparent hover:border-white/10'
          )}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start">
            <span
              className={cn(
                'font-medium',
                isToday ? 'text-solo-highlight' : '',
                isSelected ? 'text-white' : ''
              )}
            >
              {day}
            </span>
            {dateHasTasks && (
              <div className="flex">
                {allTasksCompleted ? (
                  <div className="h-5 w-5 rounded-full bg-solo-highlight/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-solo-highlight" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-solo-accent/20 flex items-center justify-center">
                    <span className="text-xs text-solo-accent">{dateTasks.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {dateHasTasks && (
            <div className="mt-auto">
              <div className="w-full bg-black/30 rounded-full h-1 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    allTasksCompleted ? 'bg-solo-highlight' : 'bg-solo-accent'
                  )}
                  style={{
                    width: `${(completedTasksCount / dateTasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Calendar
          </h1>
          <div className="flex items-center bg-black/20 rounded-lg px-3 py-1">
            <CalendarIcon className="h-4 w-4 text-solo-accent mr-2" />
            <span className="text-sm">
              {selectedDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 animate-fade-in">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-solo-secondary text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6 animate-scale-in">{renderCalendarDays()}</div>

        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4 border-b border-white/10 pb-2">
            Tasks for{' '}
            {selectedDate.toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h3>

          <div className="space-y-3">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'p-3 rounded-lg border flex items-center transition-all duration-300 cursor-pointer',
                    task.completed
                      ? 'bg-solo-highlight/10 border-solo-highlight/30'
                      : 'bg-black/20 border-white/5 hover:border-solo-accent/30'
                  )}
                  onClick={() => completeTask(task.id, !task.completed)}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center mr-3',
                      task.completed
                        ? 'bg-solo-highlight/20 text-solo-highlight'
                        : 'bg-transparent border border-white/10 text-white/30'
                    )}
                  >
                    {task.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-white/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={cn(
                        'font-medium',
                        task.completed && 'line-through text-solo-secondary'
                      )}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-solo-secondary mt-1">{task.description}</div>
                    )}
                  </div>
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
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
                <AlertCircle className="h-8 w-8 text-solo-secondary mx-auto mb-2" />
                <div className="text-solo-secondary">No tasks for this date</div>
                <p className="text-sm text-solo-secondary/70 mt-1">
                  Add new quests to level up faster
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Calendar;
