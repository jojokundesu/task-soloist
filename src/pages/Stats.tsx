
import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user, tasks, skills } from '@/data/mockData';
import GlassCard from '@/components/ui/glass-card';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Calendar, ChartBar, Clock, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generate mock weekly data
const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    name: day,
    tasks: Math.floor(Math.random() * 5) + 1,
    xp: Math.floor(Math.random() * 50) + 20,
  }));
};

// Generate mock skill distribution data
const generateSkillData = () => {
  return skills.map(skill => ({
    name: skill.name,
    value: skill.level * 10 + skill.experience / 2,
    color: getRandomColor(),
  }));
};

// Generate mock progress data
const generateProgressData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    xp: Math.floor(Math.random() * 200) + 100,
  }));
};

const getRandomColor = () => {
  const colors = ['#8B5CF6', '#6E59A5', '#D946EF', '#0EA5E9', '#F97316'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const weeklyData = generateWeeklyData();
const skillData = generateSkillData();
const progressData = generateProgressData();

// Calculate completed task percentage
const completedTasksPercent = Math.round(
  (tasks.filter(t => t.completed).length / tasks.length) * 100
);

// Calculate skill level average
const avgSkillLevel = Math.round(
  skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
);

const Stats = () => {
  const [activeTab, setActiveTab] = useState('daily');
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Statistics
          </h1>
          <div className="flex items-center bg-black/20 rounded-lg px-3 py-1">
            <ChartBar className="h-4 w-4 text-solo-accent mr-2" />
            <span className="text-sm">Level {user.level}</span>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in">
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Tasks Completed</div>
            <div className="text-xl font-bold flex items-center">
              <Calendar className="h-4 w-4 text-solo-accent mr-2" />
              {completedTasksPercent}%
            </div>
          </GlassCard>
          
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Avg. Skill Level</div>
            <div className="text-xl font-bold flex items-center">
              <TrendingUp className="h-4 w-4 text-solo-accent mr-2" />
              {avgSkillLevel}
            </div>
          </GlassCard>
        </div>
        
        {/* Chart Tabs */}
        <div className="flex mb-6 border-b border-white/10 animate-fade-in">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center",
              activeTab === 'daily' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setActiveTab('daily')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Daily
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center",
              activeTab === 'skills' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setActiveTab('skills')}
          >
            <PieChartIcon className="h-4 w-4 mr-1" />
            Skills
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center",
              activeTab === 'progress' 
                ? "border-solo-accent text-solo-accent" 
                : "border-transparent text-solo-secondary hover:text-solo-text"
            )}
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Progress
          </button>
        </div>
        
        {/* Charts */}
        <div className="animate-scale-in">
          {activeTab === 'daily' && (
            <GlassCard className="p-4">
              <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="tasks" 
                      name="Tasks" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="xp" 
                      name="XP" 
                      fill="#6E59A5" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-solo-secondary text-center">
                Task completion and XP gain per day
              </div>
            </GlassCard>
          )}
          
          {activeTab === 'skills' && (
            <GlassCard className="p-4">
              <h3 className="text-lg font-medium mb-4">Skill Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                      formatter={(value: number, name: string) => [
                        `${value} points`, name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-solo-secondary text-center">
                Distribution of skill development
              </div>
            </GlassCard>
          )}
          
          {activeTab === 'progress' && (
            <GlassCard className="p-4">
              <h3 className="text-lg font-medium mb-4">Level Progress</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      name="XP Gained" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ stroke: '#6E59A5', strokeWidth: 2, r: 4, fill: '#1A1F2C' }}
                      activeDot={{ r: 6, stroke: '#D946EF', strokeWidth: 2, fill: '#1A1F2C' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-solo-secondary text-center">
                Monthly XP progress trend
              </div>
            </GlassCard>
          )}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Stats;
