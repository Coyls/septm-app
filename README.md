# SEPTM — 7 Wonders Score Tracker

**SEPTM** is a free, open-source score tracker for the board game *7 Wonders*. Track your games, review stats, and manage your circle of players.

→ **Backend repository:** [septm-backend](https://github.com/Coyls/septm-backend)

---

## Features

- Game creation with player selection and extension support
- Detailed score entry and history
- Personal and global statistics
- Friends system
- Dark / light mode

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| State / data fetching | TanStack Query v5, Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Language | TypeScript |

The frontend proxies all `/api/v1/*` requests to the backend via Next.js rewrites — no CORS configuration required in development.

## Prerequisites

- Node.js 20+
- pnpm
- A running instance of [septm-backend](https://github.com/Coyls/septm-backend)

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/Coyls/septm-app.git
cd septm-app

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set API_INTERNAL_URL to point at your backend instance

# 4. Start the dev server (port 3001)
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL used by the browser | `/api/v1` |
| `API_INTERNAL_URL` | API base URL used by the Next.js proxy (server-side) | `http://localhost:3000/api/v1` |

> `NEXT_PUBLIC_API_URL` should stay at `/api/v1` in most setups — the proxy handles routing to the actual backend.

## Project structure

```
src/
├── app/
│   ├── (public)/        # Landing, statistics, auth pages
│   └── (app)/           # Authenticated pages (dashboard, game, friends…)
├── components/          # Shared UI components
├── lib/
│   ├── api/             # API fetch helpers
│   └── query/           # TanStack Query hooks
└── stores/              # Zustand stores
```

## Contributing

Contributions are welcome. Please open an issue before submitting a large PR so we can align on direction.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a pull request

## License

MIT — see [LICENSE](./LICENSE) for details.
