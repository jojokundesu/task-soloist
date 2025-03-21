
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ListTodo, 
  Calendar, 
  Trophy, 
  User, 
  BarChart, 
  Menu,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FloatingActionButton from '../ui/floating-action-button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

const NavBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: <ListTodo className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: <Calendar className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      name: 'Stats',
      href: '/stats',
      icon: <BarChart className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      name: 'Achievements',
      href: '/achievements',
      icon: <Trophy className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: <User className="h-6 w-6" strokeWidth={1.5} />,
    },
  ];

  const handleAddTask = () => {
    toast("This action will open the task creation form", {
      description: "It will allow you to add a new quest to your journey.",
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-solo-card/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-solo-accent to-solo-highlight bg-clip-text text-transparent">
            Task Soloist
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileMenu}
          className="text-solo-text"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={cn(
            "h-full w-4/5 max-w-xs bg-solo-card border-r border-white/10 p-6 transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6 pt-16">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-4 p-3 rounded-lg transition-all",
                  isActive(item.href)
                    ? "bg-solo-highlight/20 text-white"
                    : "text-solo-text/70 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive(item.href) && "bg-solo-accent/20 text-solo-accent"
                )}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-solo-card/80 backdrop-blur-md border-t border-white/5 z-30 flex justify-around items-center px-2">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all",
              isActive(item.href)
                ? "text-solo-accent"
                : "text-solo-text/70 hover:text-white"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg",
              isActive(item.href) && "animate-pulse-glow"
            )}>
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddTask} 
        className="bg-gradient-to-r from-solo-accent to-solo-highlight hover:from-solo-highlight hover:to-solo-accent text-white"
      />
    </>
  );
};

export default NavBar;
