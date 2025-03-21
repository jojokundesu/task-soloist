
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.tasksoloist',
  appName: 'Task Soloist',
  webDir: 'dist',
  bundledWebRuntime: true, // Package the web app with the native app
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#121318",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#8B5CF6",
      splashFullScreen: true,
      splashImmersive: true
    },
    // Explicitly declare which permissions we need (minimal)
    Permissions: {
      permissions: [] // No specific permissions needed for this app
    }
  },
  // This is required for Capacitor to work without a network connection
  loggingBehavior: 'none',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'none'
    }
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
