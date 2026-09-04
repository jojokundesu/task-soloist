# Task Soloist

**Android-first**, fully offline Solo Leveling–inspired productivity RPG.  
Level up real life through quests, habits, meditation, journaling, inventory, and an on-device Beru companion.

## Download APK (Android)

After the GitHub Action finishes (a few minutes after push):

### Direct download
**https://github.com/jojokundesu/task-soloist/releases/latest/download/TaskSoloist.apk**

### Releases page
**https://github.com/jojokundesu/task-soloist/releases**

### Install on phone
1. Open the APK link on your Android device  
2. Allow **Install unknown apps** for your browser / Files  
3. Tap **Install** → **Open**

No internet needed after install. All data stays on your device.

---

## What it is

| Mode | How it works |
|------|----------------|
| **Android APK** | Capacitor WebView + on-device storage. Zero server. |
| **Desktop web** | Optional Express + SQLite API, or same offline local DB. |

### Features
- Quests / tasks with XP, coins, priorities, categories, skill XP  
- System daily/weekly quests  
- Habits with streaks  
- Meditation timer + secret unlock  
- Journal with mood (+XP)  
- Inventory loot & consumables  
- Rewards shop (shadow coins)  
- 15+ achievements with progress  
- Real stats charts  
- Offline Beru chat  
- Rank ladder: E → Shadow Monarch  
- Local JSON backup / restore / reset  

## Dev (web)

```bash
npm install
npm run dev          # optional API :3001 + Vite :8080
# or just the client (fully offline in browser):
npm run client
```

## Build Android yourself

```bash
npm install
npm run build
npx cap add android   # first time only
npx cap sync android
npx cap open android  # Android Studio → Build → Build APK(s)
```

Or push to GitHub — workflow `.github/workflows/build-android-apk.yml` publishes the APK to Releases automatically.

## Privacy

- No cloud accounts, no Supabase, no Google login required  
- No external fonts/CDN/analytics  
- Beru runs as a local conversation engine  
- Backups are plain JSON you export yourself  

Built for hunters who want a System that lives on their phone.
