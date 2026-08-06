# MtaaFix Mobile

A Kenyan local-services marketplace mobile app — connects clients who post jobs (plumbing, electrical, cleaning, etc.) with workers who apply and get hired.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — start Expo dev server (scan QR code with Expo Go to preview on device)
- `pnpm --filter @workspace/api-server run dev` — run the local API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- Expo SDK 54, React Native 0.81, TypeScript
- Expo Router v6 (file-based routing)
- React Query (@tanstack/react-query) for server state
- Axios for HTTP (external API at https://mtaafix-api.onrender.com)
- AsyncStorage for auth token persistence
- @expo/vector-icons (Ionicons)

## Where things live

```
artifacts/mobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (providers, auth redirect)
│   ├── (tabs)/             # Main tab group
│   │   ├── _layout.tsx     # Custom bottom tab bar
│   │   ├── index.tsx       # Home screen
│   │   ├── work.tsx        # Work/jobs screen
│   │   └── bids.tsx        # Bids/applications screen
│   ├── (auth)/             # Auth stack
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── job/[id].tsx        # Job detail + apply
│   ├── post-job.tsx        # Post a job (client only)
│   └── profile.tsx         # User profile + logout
├── src/
│   ├── api/client.ts       # Axios instance (Bearer token interceptor)
│   ├── services/           # API calls + React Query hooks
│   │   ├── authService.ts
│   │   ├── jobService.ts
│   │   └── bidService.ts
│   ├── store/authStore.ts  # AsyncStorage helpers
│   ├── context/AuthContext.tsx  # Auth state, login/register/logout
│   └── types/index.ts      # TypeScript interfaces
├── components/
│   └── ui/
│       ├── BottomTabBar.tsx    # Custom black + yellow-pill tab bar
│       ├── JobCard.tsx         # Job list item
│       ├── BidCard.tsx         # Bid list item
│       ├── TabFilter.tsx       # Horizontal underline tab filter
│       └── StatusTimeline.tsx  # Job status timeline (home screen)
└── constants/colors.ts     # Dark theme tokens (primary = #D4E157)
```

## Architecture decisions

- **External backend only**: All data comes from `https://mtaafix-api.onrender.com`. The local api-server is the monorepo scaffold and unused by MtaaFix Mobile.
- **AsyncStorage for auth**: Token, role, name, phone stored with `mtaa_` namespace prefix to avoid collisions.
- **Forced dark mode**: `Appearance.setColorScheme('dark')` in `_layout.tsx` enforces the dark Figma theme on all platforms including web preview.
- **Role-based screens**: Work screen shows all available jobs for workers, own posted jobs for clients. Bids screen is worker-only.
- **Custom tab bar**: NativeTabs (iOS 26 liquid glass) intentionally skipped to preserve the specific yellow-pill brand design.

## Product

Three-tab mobile app:
1. **Home** — greeting card with username, current active job status timeline (paid → in progress → accepted), quick-post button for clients
2. **Work** — tabbed (open / in progress / closed) job listings; workers browse all jobs, clients see their own; pull-to-refresh
3. **Bids** — worker's applications filtered by accepted / completed status

Auth flow: login / register with role selection (Worker vs Client). Token persisted in AsyncStorage, rehydrated on launch.

## User preferences

_Populate as needed._

## Gotchas

- API is the external Render deployment — it may be slow on first request (cold start ~30s)
- The 401 in web console on first load is expected: React Query fires `useMyJobs` immediately; it gets a 401 and the interceptor clears auth (harmless since there is no token yet)
- `userInterfaceStyle: "dark"` in app.json covers native; `Appearance.setColorScheme('dark')` covers web
