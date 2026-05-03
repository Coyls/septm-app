## Architecture overview

**septm-app** is a Next.js 15 (App Router) application that acts as the frontend and API proxy for septm-backend.

At a high level:

- **Next.js App Router** structures pages and layouts with React Server Components by default.
- **Next.js rewrites** proxy all `/api/v1/*` requests to the backend — the browser never calls the backend directly.
- **TanStack Query** manages all server state (fetching, caching, mutations).
- **Zustand** manages client-only UI state (CSRF token, game wizard).

---

## Route groups and responsibilities

```
src/app/
├── (public)/          # Unauthenticated routes
│   ├── page.tsx       # Landing page
│   ├── auth/          # Sign-in, sign-up, forgot/reset password, verify email
│   ├── statistics/    # Public global statistics
│   ├── privacy/       # Privacy policy
│   └── terms/         # Terms of service
├── (app)/             # Authenticated routes — wrapped by AppLayout (sidebar + mobile header)
│   ├── dashboard/     # Home after login
│   ├── friends/       # Friend list, pending/received requests
│   ├── game/
│   │   ├── new/       # 3-step wizard: extensions → players → confirmation
│   │   └── [gameId]/score/  # Live score entry and leaderboard
│   └── statistics/me/ # Per-user statistics
└── components/        # Shared layout-level components (landing sections)
```

Route group convention:

- `(public)/` — no auth required. The proxy middleware passes the request through.
- `(app)/` — at least one session cookie must be present, otherwise the proxy redirects to `/auth/signin?redirect=<path>`.

---

## Middleware (proxy.ts)

`src/proxy.ts` runs as a Next.js middleware on every non-static route.

Responsibilities:

- **Auth gate**: if no `access_token` or `refresh_token` cookie is present, redirect to `/auth/signin`.
- **Auth page redirect**: if `access_token` is present on `/auth/signin` or `/auth/signup`, redirect to `/dashboard`.
- **CSP**: generates a per-request nonce and sets a strict `Content-Security-Policy` header (production only).
- **Refresh token hint**: passes `x-has-refresh-token: 1/0` to Server Component layouts, so `SessionGate` can skip a noisy 401 when no token is present.

The middleware only checks cookie **presence**, not validity. Actual token validation happens client-side in `apiFetch`.

> **OPEN_PATHS — mandatory step for public pages**
>
> `(public)/` routes are **not** automatically open. The middleware falls through to the protected-page check unless the path is listed in `OPEN_PATHS`. Any new public page added under `(public)/` **must** also be added to `OPEN_PATHS` in `src/proxy.ts`, otherwise unauthenticated visitors will be redirected to `/auth/signin`.
>
> Example: adding `src/app/(public)/science-calculator/page.tsx` requires:
> ```ts
> const OPEN_PATHS = ["/", "/statistics", "/science-calculator", "/privacy", "/terms"];
> ```

---

## Authentication flow

Authentication is entirely cookie-based — the browser never handles tokens directly.

1. **Sign-in/sign-up**: `POST /api/v1/auth/signin` → backend sets `access_token` (15 min) and `refresh_token` (30 days) as HTTP-only cookies.
2. **Subsequent requests**: `apiFetch` sends cookies automatically (`credentials: "include"`).
3. **Token expiry (401 handling)**: `apiFetch` automatically calls `POST /api/v1/auth/refresh` and retries the original request. Concurrent 401s are queued behind a single refresh to prevent token rotation conflicts.
4. **Refresh failure**: CSRF token and query cache are cleared, user is redirected to `/auth/signin`.

### SessionGate

`SessionGate` (`src/components/layout/session-gate.tsx`) is used in the `(public)/auth/` layout. It runs a client-side refresh attempt on mount if `x-has-refresh-token` is set. If the refresh succeeds, it redirects to `/dashboard` (or the `redirect` query param) without rendering the auth page.

### CSRF

Every mutation (`POST`, `PATCH`, `PUT`, `DELETE`) must include an `x-csrf-token` header.

- `CsrfProvider` fetches the token from `GET /api/v1/auth/csrf` on mount and stores it in the `csrf` Zustand store.
- `apiFetch` reads the store and injects the header automatically for mutating methods.
- `POST /api/v1/auth/refresh` is exempt from CSRF (handled by the backend).

---

## Data fetching layer

```
src/lib/
├── api/           # Raw fetch functions (one file per domain)
│   ├── fetch.ts   # apiFetch — core fetch wrapper with 401/CSRF handling
│   ├── auth.ts
│   ├── game.ts
│   ├── friends.ts
│   ├── statistics.ts
│   └── user.ts
└── query/
    ├── client.ts       # TanStack Query client singleton
    ├── keys.ts         # Centralized query key factory
    └── hooks/          # Domain hooks (useAuth, useGame, useFriends, …)
```

Convention:

- `api/*.ts` files export plain `async` functions that call `apiFetch`. They have no React dependency.
- `query/hooks/*.ts` files wrap those functions in `useQuery` / `useMutation`. All query keys are defined in `keys.ts`.

---

## State management

| Store        | File                          | Persisted        | Purpose                               |
| ------------ | ----------------------------- | ---------------- | ------------------------------------- |
| `csrf`       | `stores/csrf.store.ts`        | No               | Holds the current CSRF token          |
| `gameWizard` | `stores/game-wizard.store.ts` | `sessionStorage` | Multi-step game creation wizard state |

---

## Component structure

```
src/components/
├── ui/            # shadcn/ui primitives (auto-generated, do not hand-edit)
├── layout/        # App shell: Sidebar, MobileHeader, SessionGate, PublicNav, PublicFooter
├── providers/     # React context providers: QueryProvider, CsrfProvider, ToasterProvider
├── account/       # Account dialog
├── friends/       # Friend combobox
├── game/          # Reusable game components: WonderCard, WonderPicker, LiveLeaderboard, PlayerScoreCard
└── statistics/    # Chart components and stat cards
```

Page-specific components live in `_components/` subdirectories next to their page (`app/(app)/game/new/_components/`). They are **not exported** outside their page.

---

## Providers tree (root layout)

```
ThemeProvider
└── QueryProvider
    └── CsrfProvider
        └── TooltipProvider
            └── {children}
            <ToasterProvider />
```

---

## Fonts and styling

- **Tailwind CSS 4** for utility classes.
- **CSS variables**: `--font-sans` (Inter) and `--font-cinzel` (Cinzel) loaded via `next/font/google`.
- **shadcn/ui** for component primitives — configured via `components.json`.
- **Theme**: light and dark, toggled manually from the account dialog (`useTheme`). `enableSystem: false` — the OS preference is ignored.

---

## Observability

Sentry is integrated via `@sentry/nextjs`:

- `sentry.server.config.ts` — server-side instrumentation.
- `sentry.edge.config.ts` — edge runtime instrumentation.
- `src/instrumentation.ts` / `instrumentation-client.ts` — Next.js instrumentation hooks.
- Source maps uploaded during CI builds (`silent: !process.env.CI`).
- Browser requests tunneled through `/monitoring` to bypass ad-blockers.

---

## Extensibility

When adding a new feature:

1. Add the route in the appropriate group (`(public)/` or `(app)/`).
2. **If the route is public**: add its path to `OPEN_PATHS` in `src/proxy.ts`. Skipping this step redirects unauthenticated users to `/auth/signin`.
3. Create `_components/` for page-local components.
4. Add a raw API function in `src/lib/api/<domain>.ts`.
5. Add query keys in `src/lib/query/keys.ts`.
6. Add hooks in `src/lib/query/hooks/use<Domain>.ts`.
7. If the decision is **hard to reverse or structuring**, capture it in an ADR under `docs/adr/`.
