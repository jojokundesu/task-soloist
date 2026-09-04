import React, { useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
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
import { useApp } from '@/context/AppContext';

const Stats = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('daily');
  const stats = state?.stats;
  const user = state?.user;
  const overview = stats?.overview;

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  const weeklyData = stats.weeklyData?.length
    ? stats.weeklyData
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name) => ({
        name,
        tasks: 0,
        xp: 0,
        meditations: 0,
        date: '',
      }));

  const skillData = stats.skillData?.length
    ? stats.skillData
    : [{ name: 'None', value: 1, level: 0, color: '#8B5CF6' }];

  const progressData = stats.progressData?.length
    ? stats.progressData
    : [{ name: '—', xp: 0, tasks: 0 }];

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Statistics
          </h1>
          <div className="flex items-center bg-black/20 rounded-lg px-3 py-1">
            <ChartBar className="h-4 w-4 text-solo-accent mr-2" />
            <span className="text-sm">Level {user.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Completion Rate</div>
            <div className="text-xl font-bold flex items-center">
              <Calendar className="h-4 w-4 text-solo-accent mr-2" />
              {overview?.completionRate ?? 0}%
            </div>
          </GlassCard>
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Avg. Skill Level</div>
            <div className="text-xl font-bold flex items-center">
              <TrendingUp className="h-4 w-4 text-solo-accent mr-2" />
              {overview?.avgSkillLevel ?? 0}
            </div>
          </GlassCard>
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Current Streak</div>
            <div className="text-xl font-bold">{overview?.currentStreak ?? 0} days</div>
          </GlassCard>
          <GlassCard className="p-3">
            <div className="text-solo-secondary text-xs">Total XP Earned</div>
            <div className="text-xl font-bold">{overview?.totalXp ?? 0}</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <GlassCard className="p-2">
            <div className="text-lg font-bold text-solo-accent">{overview?.completed ?? 0}</div>
            <div className="text-[10px] text-solo-secondary">Done</div>
          </GlassCard>
          <GlassCard className="p-2">
            <div className="text-lg font-bold">{overview?.pending ?? 0}</div>
            <div className="text-[10px] text-solo-secondary">Pending</div>
          </GlassCard>
          <GlassCard className="p-2">
            <div className="text-lg font-bold text-solo-highlight">
              {overview?.achievementsUnlocked ?? 0}/{overview?.achievementsTotal ?? 0}
            </div>
            <div className="text-[10px] text-solo-secondary">Achievements</div>
          </GlassCard>
        </div>

        {/* Category breakdown */}
        {stats.categoryBreakdown?.length > 0 && (
          <GlassCard className="mb-6 animate-fade-in">
            <h3 className="text-sm font-medium mb-3">By Category</h3>
            <div className="space-y-2">
              {stats.categoryBreakdown.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-solo-secondary">
                    {cat.completed}/{cat.total}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="flex mb-6 border-b border-white/10 animate-fade-in">
          {(
            [
              { id: 'daily', icon: Clock, label: 'Daily' },
              { id: 'skills', icon: PieChartIcon, label: 'Skills' },
              { id: 'progress', icon: TrendingUp, label: 'Progress' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center',
                activeTab === tab.id
                  ? 'border-solo-accent text-solo-accent'
                  : 'border-transparent text-solo-secondary hover:text-solo-text'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-scale-in">
          {activeTab === 'daily' && (
            <GlassCard className="p-4">
              <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="tasks" name="Tasks" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="xp" name="XP" fill="#6E59A5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-solo-secondary text-center">
                Real data from your local database
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
                        color: 'white',
                      }}
                      formatter={(value: number, name: string) => [`${Math.round(value)} pts`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {activeTab === 'progress' && (
            <GlassCard className="p-4">
              <h3 className="text-lg font-medium mb-4">XP Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="xp"
                      name="XP Gained"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ stroke: '#6E59A5', strokeWidth: 2, r: 3, fill: '#1A1F2C' }}
                      activeDot={{ r: 5, stroke: '#D946EF', strokeWidth: 2, fill: '#1A1F2C' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
