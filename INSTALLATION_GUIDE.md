
# Task Soloist Installation Guide for Android

This guide will help you install the Task Soloist app on your Android device, even if you're not tech-savvy.

## Option 1: Direct APK Installation (Easiest)

1. **Download the APK file**
   - Click on the APK file that was shared with you
   - If prompted, tap "Download" to save it to your device

2. **Install the APK**
   - Tap on the downloaded APK file
   - If prompted about security settings, tap "Settings"
   - Enable "Install from Unknown Sources" or "Install Unknown Apps" for your browser or file manager
   - Go back and tap the APK file again
   - Tap "Install"
   - Wait for the installation to complete
   - Tap "Open" to start the app

## Option 2: Build It Yourself (More Advanced)

If you want to build the app yourself:

1. **Set up your computer**
   - Install [Node.js](https://nodejs.org/en/download/) (select the LTS version)
   - Install [Android Studio](https://developer.android.com/studio)
   - During Android Studio installation, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

2. **Get the code**
   - Download the project files (zip file)
   - Extract the zip file to a folder

3. **Open Command Prompt or Terminal**
   - Navigate to the extracted project folder
   - Type these commands one at a time and press Enter after each:
     ```
     npm install
     npm run build
     npx cap add android
     npx cap sync
     ```

4. **Build the APK**
   - Type this command and press Enter:
     ```
     npx cap open android
     ```
   - Android Studio will open
   - In Android Studio, click "Build" from the top menu
   - Select "Build Bundle(s) / APK(s)"
   - Click "Build APK(s)"
   - Wait for the build to complete

5. **Install on your phone**
   - Connect your Android phone to your computer with a USB cable
   - Make sure USB debugging is enabled on your phone (in Developer options)
   - In Android Studio, click "Run" from the top menu
   - Select "Run 'app'"
   - Select your connected device
   - The app will install and run on your phone

## About Permissions

Task Soloist respects your privacy:
- It only stores data on your device's local storage
- It doesn't require any special permissions
- Your data stays on your device unless you choose to use the optional Google account backup feature
- Google account backup is completely optional and the app works 100% offline without it

## Troubleshooting

If you have any issues:
- Make sure your Android version is 6.0 or newer
- Check that you have enough storage space on your device
- If installing from APK, make sure you allowed installation from unknown sources
- Try restarting your device and trying again

Enjoy using Task Soloist to level up your life!
