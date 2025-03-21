
import React from 'react';
import NavBar from '@/components/navigation/nav-bar';
import { user, skills } from '@/data/mockData';
import GlassCard from '@/components/ui/glass-card';
import ProgressRing from '@/components/ui/progress-ring';
import { 
  User as UserIcon, 
  Settings, 
  Crown, 
  Award, 
  Trophy, 
  Target, 
  ChartBar, 
  Heart,
  Brain,
  Activity,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile = () => {
  const experiencePercentage = (user.experience / user.nextLevelExperience) * 100;
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Your Profile
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full bg-black/20 hover:bg-black/30"
            onClick={() => toast("Settings would open here")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Hero Card */}
        <GlassCard className="mb-6 animate-scale-in">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-solo-accent to-solo-highlight flex items-center justify-center mr-4">
              <UserIcon className="h-10 w-10 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex items-center">
                <span className="text-solo-secondary">{user.rank}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-solo-accent/20 text-solo-accent text-xs">
                  Level {user.level}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm">{user.currency} coins</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <ProgressRing 
              progress={experiencePercentage} 
              size={150}
              strokeWidth={12}
              background="rgba(0,0,0,0.3)"
              foreground="rgb(139, 92, 246)"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-solo-secondary text-sm">LEVEL</span>
                <span className="text-4xl font-bold">{user.level}</span>
                <span className="text-xs text-solo-secondary">{user.experience}/{user.nextLevelExperience} XP</span>
              </div>
            </ProgressRing>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                <Trophy className="h-5 w-5 text-solo-accent" />
              </div>
              <div>
                <div className="text-sm text-solo-secondary">Achievements</div>
                <div className="font-bold">14/50</div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-solo-accent" />
              </div>
              <div>
                <div className="text-sm text-solo-secondary">Quests</div>
                <div className="font-bold">98 completed</div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-solo-accent" />
              </div>
              <div>
                <div className="text-sm text-solo-secondary">Streak</div>
                <div className="font-bold">7 days</div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-solo-accent/20 flex items-center justify-center mr-3">
                <ChartBar className="h-5 w-5 text-solo-accent" />
              </div>
              <div>
                <div className="text-sm text-solo-secondary">Total XP</div>
                <div className="font-bold">1,345</div>
              </div>
            </div>
          </div>
        </GlassCard>
        
        {/* Stats Section */}
        <h3 className="text-lg font-medium mb-3 animate-fade-in">Stats</h3>
        <GlassCard className="mb-6 animate-scale-in">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(user.stats).map(([stat, value]) => (
              <StatItem 
                key={stat} 
                name={stat} 
                value={value} 
                maxValue={10}
              />
            ))}
          </div>
        </GlassCard>
        
        {/* Skills Section */}
        <h3 className="text-lg font-medium mb-3 animate-fade-in">Skills</h3>
        <div className="space-y-4 mb-6 animate-scale-in">
          {skills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
};

interface StatItemProps {
  name: string;
  value: number;
  maxValue: number;
}

const StatItem = ({ name, value, maxValue }: StatItemProps) => {
  const percentage = (value / maxValue) * 100;
  
  // Get the appropriate icon based on stat name
  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'strength':
        return <Activity className="h-5 w-5 text-solo-accent" />;
      case 'intelligence':
        return <Brain className="h-5 w-5 text-solo-accent" />;
      case 'charisma':
        return <Heart className="h-5 w-5 text-solo-accent" />;
      case 'endurance':
        return <Target className="h-5 w-5 text-solo-accent" />;
      case 'focus':
        return <BookOpen className="h-5 w-5 text-solo-accent" />;
      default:
        return <Award className="h-5 w-5 text-solo-accent" />;
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded-full bg-solo-accent/20 flex items-center justify-center mr-2">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="text-sm capitalize">{name}</div>
          <div className="text-xs text-solo-secondary">{value}/{maxValue}</div>
        </div>
      </div>
      
      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-solo-accent to-solo-highlight h-full rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface SkillItemProps {
  skill: {
    id: string;
    name: string;
    level: number;
    experience: number;
    nextLevelExp: number;
    icon?: string;
  };
}

const SkillItem = ({ skill }: SkillItemProps) => {
  const percentage = (skill.experience / skill.nextLevelExp) * 100;
  
  // Get the appropriate icon based on skill name
  const getIcon = () => {
    switch (skill.icon) {
      case 'activity':
        return <Activity className="h-6 w-6" />;
      case 'book-open':
        return <BookOpen className="h-6 w-6" />;
      case 'brain':
        return <Brain className="h-6 w-6" />;
      case 'clock':
        return <Clock className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };
  
  return (
    <GlassCard>
      <div className="flex items-center">
        <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-solo-accent/20 to-solo-highlight/20 flex items-center justify-center mr-4">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm bg-solo-highlight/20 text-solo-highlight py-0.5 px-2 rounded-full">
              Lv. {skill.level}
            </span>
          </div>
          
          <div className="flex justify-between text-xs text-solo-secondary mb-1">
            <span>Experience</span>
            <span>{skill.experience}/{skill.nextLevelExp}</span>
          </div>
          
          <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                percentage < 30 ? "bg-red-500" : 
                percentage < 70 ? "bg-yellow-500" : 
                "bg-gradient-to-r from-solo-accent to-solo-highlight"
              )}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default Profile;
