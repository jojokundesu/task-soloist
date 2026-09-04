# Task Soloist — Installation Guide

Task Soloist is a **fully offline full-stack app**. After install, it needs no internet.

## Web (desktop / laptop)

### Requirements
- Node.js 18+ (LTS recommended)
- npm 9+

### Run in development

```bash
npm install
npm run dev
```

This starts:
- **API + SQLite** on port `3001`
- **Vite frontend** on port `8080` (proxies `/api` locally)

Open the Vite URL in your browser.

### Production (single server)

```bash
npm install
npm run build
npm start
```

Visit `http://localhost:3001` — Express serves both the API and the built UI.

## Android (Capacitor)

1. `npm install && npm run build`
2. `npx cap add android` (first time)
3. `npx cap sync`
4. `npx cap open android` → Build APK in Android Studio

The app stores data on-device. Pair with the local Node server for full API features when developing; packaged builds can embed or point at a local backend.

## Data location

| Item | Path |
|------|------|
| SQLite DB | `data/task-soloist.db` |
| JSON backups | Exported from **Profile → Local Backup** |

## Privacy

- No cloud accounts
- No Google / Supabase / OpenAI calls
- No external fonts or analytics CDNs
- Beru chat runs as a local conversation engine
- Optional JSON export stays on your machine

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Local server unreachable” | Run `npm run dev` (both processes) |
| Port in use | Set `PORT=3002` for API; update Vite proxy if needed |
| Corrupt data | Profile → Reset, or delete `data/*.db*` |
| blank screen offline | Ensure service worker registered after first online load of assets |

Enjoy leveling up, hunter.
