# Task Soloist — Android Installation

## Fastest path: download the APK

### Direct download link
**https://github.com/jojokundesu/task-soloist/releases/latest/download/TaskSoloist.apk**

### This release
**https://github.com/jojokundesu/task-soloist/releases/download/apk-1/TaskSoloist.apk**

### Releases page
**https://github.com/jojokundesu/task-soloist/releases**

---

## Install on your Android phone

1. Open the **Direct download link** above **on your phone** (Chrome / Firefox / Samsung Internet).
2. When the file finishes downloading, open it from the notification shade or **Files / Downloads**.
3. If Android blocks it:
   - Tap **Settings** on the warning
   - Enable **Allow from this source** (for your browser or Files app)
   - Go back and tap the APK again
4. Tap **Install** → wait a few seconds → tap **Open**.

### Requirements
- Android 6.0 (API 23) or newer  
- ~10 MB free storage  
- No Google account, no Play Store, no internet after install  

---

## What you get

Task Soloist is an **Android-first offline app**:
- Quests, habits, meditation, journal, inventory, rewards  
- XP, ranks (E → Shadow Monarch), achievements  
- Offline Beru chat companion  
- All data stored on your phone  

---

## Optional: build the APK yourself

```bash
npm install
npm run build
npx cap add android    # first time
npx cap sync android
npx cap open android   # Android Studio → Build → Build APK(s)
```

Or push to GitHub — the Action `.github/workflows/build-android-apk.yml` builds and uploads `TaskSoloist.apk` to Releases automatically.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| “Blocked by Play Protect” | Tap **More details** → **Install anyway** (debug sideload is normal for personal APKs) |
| “App not installed” | Uninstall any older Task Soloist first, or free storage |
| Download is HTML not APK | Use the **direct** `.apk` link, not the releases homepage alone |
| Want a fresh install | Clear app storage or reinstall the APK |

Enjoy leveling up, hunter.
