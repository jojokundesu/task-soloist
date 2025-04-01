
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks";
import Achievements from "./pages/Achievements";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import Meditation from "./pages/Meditation";
import Chat from "./pages/Chat";
import { useEffect, useState } from "react";
import { initializeApp } from "./services/initService";
import Onboarding from "./components/intro/Onboarding";
import { UserData } from "./components/intro/BeruDialog";

// Configure the QueryClient for offline-first behavior
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Don't refetch data automatically
      retry: false, // Don't retry failed requests (better for offline)
      networkMode: 'always', // Works with or without network
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(
    localStorage.getItem("onboardingComplete") === "true"
  );

  // Initialize the app with default data from localStorage on startup
  useEffect(() => {
    console.log("Initializing app...");
    // Initialize the app data
    initializeApp();
    setIsInitialized(true);
    
    // Check if onboarding should be shown
    console.log("Onboarding completed status:", localStorage.getItem("onboardingComplete") === "true");
    if (localStorage.getItem("onboardingComplete") !== "true") {
      console.log("Showing onboarding...");
      setShowOnboarding(true);
    } else {
      console.log("Onboarding already completed, skipping");
    }
    
    // Listen for app going online/offline and handle accordingly
    const handleOnline = () => console.log("App is online");
    const handleOffline = () => console.log("App is offline - using local data");
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOnboardingComplete = (userData: UserData) => {
    // Save user data
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("onboardingComplete", "true");
    setOnboardingComplete(true);
    setShowOnboarding(false);
  };

  // Show nothing until initialization is complete
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-solo-bg">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showOnboarding && !onboardingComplete && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
