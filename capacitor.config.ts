
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6c03966d9bf04a1b8b1402bebcb6368a',
  appName: 'Task Soloist',
  webDir: 'dist',
  server: {
    url: "https://6c03966d-9bf0-4a1b-8b14-02bebcb6368a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#121318",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#8B5CF6",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
