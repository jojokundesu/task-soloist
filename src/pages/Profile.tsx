import React, { useRef, useState } from 'react';
import NavBar from '@/components/navigation/nav-bar';
import GlassCard from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award,
  Book,
  Brain,
  Download,
  Dumbbell,
  Flame,
  Shield,
  Trophy,
  Upload,
  Clock,
  RotateCcw,
  Save,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';

const Profile = () => {
  const {
    state,
    online,
    updateUser,
    exportBackup,
    importBackup,
    resetAll,
  } = useApp();
  const user = state?.user;
  const skills = state?.skills || [];
  const achievements = state?.achievements || [];
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  const handleSaveName = async () => {
    if (name.trim()) {
      await updateUser({ name: name.trim() });
      setEditing(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await importBackup(file);
    e.target.value = '';
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Reset all data to defaults? This cannot be undone unless you have a backup.'
      )
    ) {
      await resetAll();
      window.location.href = '/';
    }
  };

  const lastBackup = localStorage.getItem('last_backup_date');

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        <GlassCard className="mb-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-solo-accent to-solo-highlight flex items-center justify-center text-2xl font-bold">
              {(user.name || 'H').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/20 border-white/10"
                  />
                  <Button size="sm" className="bg-solo-accent" onClick={handleSaveName}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h1
                  className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent cursor-pointer"
                  onClick={() => {
                    setName(user.name);
                    setEditing(true);
                  }}
                  title="Click to edit"
                >
                  {user.name}
                </h1>
              )}
              <p className="text-solo-secondary">{user.rank}</p>
              <p className="text-xs text-solo-secondary/70 mt-0.5">
                {user.profile?.title || 'Shadow Monarch'}
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div>
            <div className="flex items-center justify-between">
              <div className="text-solo-secondary">Level {user.level}</div>
              <div className="text-solo-secondary">
                {user.experience}/{user.nextLevelExperience} XP
              </div>
            </div>
            <Progress
              value={(user.experience / Math.max(user.nextLevelExperience, 1)) * 100}
              className="h-2 mt-2 bg-black/20"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
            <div>
              <div className="font-bold text-solo-accent">{user.currency}</div>
              <div className="text-xs text-solo-secondary">Coins</div>
            </div>
            <div>
              <div className="font-bold">{user.totals?.currentStreak ?? 0}</div>
              <div className="text-xs text-solo-secondary">Streak</div>
            </div>
            <div>
              <div className="font-bold">{user.totals?.tasksCompleted ?? 0}</div>
              <div className="text-xs text-solo-secondary">Quests</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-solo-accent" />
              Strength: {user.stats.strength}
            </div>
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-solo-accent" />
              Intelligence: {user.stats.intelligence}
            </div>
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-solo-accent" />
              Charisma: {user.stats.charisma}
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-solo-accent" />
              Endurance: {user.stats.endurance}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-solo-accent" />
              Focus: {user.stats.focus}
            </div>
          </div>
        </GlassCard>

        {/* Android APK download */}
        <GlassCard className="mb-6 animate-fade-in border-solo-accent/30">
          <h2 className="text-lg font-semibold mb-2 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Android APK
          </h2>
          <p className="text-sm text-solo-secondary mb-3">
            Install Task Soloist on your phone — fully offline, no account needed.
          </p>
          <a
            href="https://github.com/jojokundesu/task-soloist/releases/latest/download/TaskSoloist.apk"
            className="flex items-center justify-center w-full py-3 rounded-lg bg-gradient-to-r from-solo-accent to-solo-highlight text-white font-semibold text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4 mr-2" />
            Download TaskSoloist.apk
          </a>
          <a
            href="https://github.com/jojokundesu/task-soloist/releases"
            className="block text-center text-xs text-solo-accent mt-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            All releases on GitHub
          </a>
        </GlassCard>

        {/* Local backup — fully offline */}
        <GlassCard className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
              Local Backup
            </h2>
            <div className="flex items-center gap-1 text-xs text-solo-secondary">
              {online ? (
                <>
                  <Wifi className="h-3 w-3 text-green-400" /> API online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-400" /> API offline
                </>
              )}
            </div>
          </div>
          <p className="text-sm text-solo-secondary mb-4">
            Everything runs on your device. Export a JSON backup file or restore from one — no
            cloud or Google account required.
          </p>
          {lastBackup && (
            <p className="text-xs text-solo-secondary mb-3">
              Last export: {new Date(lastBackup).toLocaleString()}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button className="flex-1 bg-solo-accent" onClick={() => exportBackup()}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <Button
            variant="ghost"
            className="w-full mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset all data
          </Button>
        </GlassCard>

        <GlassCard className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {skill.icon === 'activity' && (
                      <Dumbbell className="h-5 w-5 mr-2 text-solo-accent" />
                    )}
                    {skill.icon === 'book-open' && (
                      <Book className="h-5 w-5 mr-2 text-solo-accent" />
                    )}
                    {skill.icon === 'brain' && (
                      <Brain className="h-5 w-5 mr-2 text-solo-accent" />
                    )}
                    {skill.icon === 'languages' && (
                      <Award className="h-5 w-5 mr-2 text-solo-accent" />
                    )}
                    {skill.icon === 'clock' && (
                      <Clock className="h-5 w-5 mr-2 text-solo-accent" />
                    )}
                    {!['activity', 'book-open', 'brain', 'languages', 'clock'].includes(
                      skill.icon || ''
                    ) && <Award className="h-5 w-5 mr-2 text-solo-accent" />}
                    {skill.name}
                  </div>
                  <Badge variant="secondary">Level {skill.level}</Badge>
                </div>
                <Progress
                  value={(skill.experience / Math.max(skill.nextLevelExp, 1)) * 100}
                  className="h-1 bg-black/30"
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Achievements
          </h2>
          <div className="space-y-3">
            {achievements.slice(0, 8).map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-solo-accent" />
                  {achievement.name}
                </div>
                {achievement.completed ? (
                  <Trophy className="h-5 w-5 text-solo-highlight" />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <NavBar />
    </div>
  );
};

export default Profile;
