import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ListTodo,
  Calendar,
  Trophy,
  User,
  BarChart,
  Menu,
  X,
  Brain,
  Flame,
  BookOpen,
  Package,
  Gift,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import FloatingActionButton from '../ui/floating-action-button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: <Home className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Tasks', href: '/tasks', icon: <ListTodo className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Habits', href: '/habits', icon: <Flame className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Calendar', href: '/calendar', icon: <Calendar className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Stats', href: '/stats', icon: <BarChart className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Achieve', href: '/achievements', icon: <Trophy className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Meditate', href: '/meditation', icon: <Brain className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Journal', href: '/journal', icon: <BookOpen className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Inventory', href: '/inventory', icon: <Package className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Rewards', href: '/rewards', icon: <Gift className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Beru', href: '/chat', icon: <MessageCircle className="h-6 w-6" strokeWidth={1.5} /> },
    { name: 'Profile', href: '/profile', icon: <User className="h-6 w-6" strokeWidth={1.5} /> },
  ];

  const bottomItems = [
    navItems[0], // Home
    navItems[1], // Tasks
    navItems[2], // Habits
    navItems[4], // Stats
    navItems[11], // Profile
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-solo-card/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Task Soloist
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-solo-text"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={cn(
          'fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={cn(
            'h-full w-4/5 max-w-xs bg-solo-card border-r border-white/10 p-6 transition-transform duration-300 ease-out overflow-y-auto',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2 pt-16">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-4 p-3 rounded-lg transition-all',
                  isActive(item.href)
                    ? 'bg-solo-highlight/20 text-white'
                    : 'text-solo-text/70 hover:bg-white/5 hover:text-white'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    isActive(item.href) && 'bg-solo-accent/20 text-solo-accent'
                  )}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-solo-card/80 backdrop-blur-md border-t border-white/5 z-30 flex justify-around items-center px-2">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all',
              isActive(item.href) ? 'text-solo-accent' : 'text-solo-text/70 hover:text-white'
            )}
          >
            <div className={cn('p-1 rounded-lg', isActive(item.href) && 'animate-pulse-glow')}>
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>

      {location.pathname !== '/tasks' && (
        <FloatingActionButton
          onClick={() => navigate('/tasks')}
          className="bg-gradient-to-r from-solo-accent to-solo-highlight hover:from-solo-highlight hover:to-solo-accent text-white"
        />
      )}
    </>
  );
};

export default NavBar;
