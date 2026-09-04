import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.tasksoloist.hunter',
  appName: 'Task Soloist',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Fully offline — load from bundled assets, never remote
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#121318',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#8B5CF6',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#121318',
    },
  },
  loggingBehavior: 'production',
  android: {
    allowMixedContent: false,
    backgroundColor: '#121318',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK',
    },
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
