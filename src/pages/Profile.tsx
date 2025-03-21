import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user, skills, achievements } from '@/data/mockData';
import GlassCard from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Book, Brain, Dumbbell, Flame, Star, Clock as ClockIcon, Shield, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Profile Header */}
        <GlassCard className="mb-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-700">
              {/* Placeholder for user avatar */}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
                {user.name}
              </h1>
              <p className="text-solo-secondary">{user.rank}</p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div>
            <div className="flex items-center justify-between">
              <div className="text-solo-secondary">Level {user.level}</div>
              <div className="text-solo-secondary">{user.experience}/{user.nextLevelExperience} XP</div>
            </div>
            <Progress value={(user.experience / user.nextLevelExperience) * 100} className="h-2 mt-2 bg-black/20" />
          </div>
        </GlassCard>

        {/* Stats */}
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
              <ClockIcon className="h-5 w-5 mr-2 text-solo-accent" />
              Focus: {user.stats.focus}
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <GlassCard className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {skill.icon === 'activity' && <Dumbbell className="h-5 w-5 mr-2 text-solo-accent" />}
                  {skill.icon === 'book-open' && <Book className="h-5 w-5 mr-2 text-solo-accent" />}
                  {skill.icon === 'brain' && <Brain className="h-5 w-5 mr-2 text-solo-accent" />}
                  {skill.icon === 'languages' && <Award className="h-5 w-5 mr-2 text-solo-accent" />}
                  {skill.icon === 'clock' && <ClockIcon className="h-5 w-5 mr-2 text-solo-accent" />}
                  {skill.name}
                </div>
                <Badge variant="secondary">Level {skill.level}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Achievements
          </h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {achievement.icon === 'footprints' && <Flame className="h-5 w-5 mr-2 text-solo-accent" />}
                  {achievement.icon === 'sun' && <Star className="h-5 w-5 mr-2 text-solo-accent" />}
                  {achievement.icon === 'flame' && <Flame className="h-5 w-5 mr-2 text-solo-accent" />}
                  {achievement.icon === 'book' && <Book className="h-5 w-5 mr-2 text-solo-accent" />}
                  {achievement.icon === 'dumbbell' && <Dumbbell className="h-5 w-5 mr-2 text-solo-accent" />}
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
