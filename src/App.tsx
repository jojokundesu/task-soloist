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
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Inventory from "./pages/Inventory";
import Rewards from "./pages/Rewards";
import { useEffect, useState } from "react";
import Onboarding from "./components/intro/Onboarding";
import { UserData } from "./components/intro/BeruDialog";
import BeruHelp from "./components/help/BeruHelp";
import { AppProvider, useApp } from "./context/AppContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      networkMode: "always",
    },
  },
});

function AppRoutes() {
  const { loading, error, refresh, finishOnboarding, state } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(
    () =>
      localStorage.getItem("onboardingComplete") === "true" ||
      localStorage.getItem("onboarding_completed") === "true"
  );

  useEffect(() => {
    if (!loading && !onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [loading, onboardingComplete]);

  useEffect(() => {
    // Register local service worker for offline shell caching (web only)
    const isNative =
      typeof (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
        .Capacitor?.isNativePlatform === "function" &&
      (window as unknown as { Capacitor: { isNativePlatform: () => boolean } }).Capacitor.isNativePlatform();
    if (!isNative && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* optional */
      });
    }
    // Force offline-first storage on native
    if (isNative) {
      localStorage.setItem("force_offline", "true");
    }
  }, []);

  const handleOnboardingComplete = async (userData: UserData) => {
    await finishOnboarding({
      name: userData?.name || "Shadow Monarch",
      age: Number(userData?.age) || 25,
      height: Number(userData?.height) || 175,
      weight: Number(userData?.weight) || 70,
      bodyFatPercentage: Number(userData?.bodyFatPercentage) || 15,
      intelligenceLevel: Number(userData?.intelligenceLevel) || 5,
      strengthLevel: Number(userData?.strengthLevel) || 5,
    });
    setOnboardingComplete(true);
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-solo-bg gap-4">
        <div className="w-10 h-10 border-4 border-solo-accent rounded-full animate-spin border-t-transparent" />
        <p className="text-solo-secondary text-sm">Awakening the System...</p>
      </div>
    );
  }

  return (
    <>
      {error && !state?.user && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-900/90 text-white text-sm px-4 py-2 flex items-center justify-between">
          <span>Could not load hunter data. Tap retry.</span>
          <button className="underline" onClick={() => refresh()}>
            Retry
          </button>
        </div>
      )}      {showOnboarding && !onboardingComplete && (
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
          <Route path="/habits" element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BeruHelp />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
