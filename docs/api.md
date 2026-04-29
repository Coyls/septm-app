## API overview

**septm-app** never calls the backend directly from the browser. All `/api/v1/*` requests are proxied through Next.js rewrites to `API_INTERNAL_URL` (defaults to `http://localhost:3000/api/v1`).

From the browser's perspective, the API base URL is always `/api/v1`.

For the backend's own API reference (routes, payloads, error format), see `septm-backend/docs/api.md`.

---

## Proxy configuration

Defined in `next.config.ts`:

```ts
rewrites: [
  { source: "/api/v1/:path*", destination: `${API_INTERNAL_URL}/:path*` },
];
```

`API_INTERNAL_URL` is a **server-side** env var — it is never exposed to the browser.
`NEXT_PUBLIC_API_URL` is the **client-side** base used by `apiFetch` (defaults to `/api/v1`).

---

## apiFetch

`src/lib/fetch.ts` is the single entry point for all API calls.

Behaviour:

- Sets `Content-Type: application/json` and `credentials: "include"` on every request.
- Injects `x-csrf-token` automatically for mutating methods (`POST`, `PATCH`, `PUT`, `DELETE`).
- On **401**: attempts a silent token refresh (`POST /auth/refresh`). Concurrent 401s are queued — only one refresh is in flight at a time.
  - Refresh success → retries the original request with fresh cookies.
  - Refresh failure → clears CSRF store, clears query cache, redirects to `/auth/signin`.
- On **204 / non-JSON**: returns `true`.
- On any non-ok response: throws `AppError(code, status, message)`.

---

## Authentication endpoints (consumed by the app)

| Method | Path                        | Notes                                                              |
| ------ | --------------------------- | ------------------------------------------------------------------ |
| `POST` | `/auth/signup`              | Creates account, sets auth cookies                                 |
| `POST` | `/auth/signin`              | Login, sets auth cookies                                           |
| `POST` | `/auth/refresh`             | Rotates tokens. CSRF-exempt. Used by `apiFetch` and `SessionGate`. |
| `POST` | `/auth/signout`             | Clears auth cookies                                                |
| `GET`  | `/auth/me`                  | Returns `AuthUser` — used by `useMe` hook                          |
| `GET`  | `/auth/csrf`                | Returns `{ csrfToken }` — fetched by `CsrfProvider` on mount       |
| `GET`  | `/auth/verify-email?token=` | Verifies email                                                     |
| `POST` | `/auth/resend-verification` | Resends verification email                                         |
| `POST` | `/auth/forgot-password`     | Sends reset email                                                  |
| `POST` | `/auth/reset-password`      | Resets password via token                                          |

---

## Key types

All shared types are defined in `src/lib/types.ts`.

### Domain enums

```ts
type ExtensionId = "VANILLA" | "LEADER" | "CITIES" | "ARMADA" | "EDIFICE" | "GRAND_PROJECT" | "BABEL" | "WONDER_PACK"
type WonderId    = "OLYMPIA" | "EPHESOS" | "GIZAH" | ... (17 wonders)
type PointTypeId = "COIN" | "WONDER" | "LAND_WAR" | "ARMADA_WAR" | "COMMERCE" | "CIVIL" | "SCIENTIST" | "GUILD" | "LEADER" | "CITIES" | "ARMADA" | "EDIFICE" | "GRAND_PROJECT" | "BABEL"
type Side        = "A" | "B"
type GameStatus  = "STARTED" | "FINISHED"
```

### Notable interfaces

- `GameOptions` — extensions, wonders, point types returned by `GET /game/options`.
- `CreateGameBody` / `CreateGameResponse` — game creation payload and response.
- `UpsertGameScoreBody` — score submission per player.
- `StatisticsResponse` — full statistics payload (global and per-user share the same shape).
- `FriendEntry`, `ReceivedRequest`, `SentRequest` — friendship data.

---

## Error handling

`apiFetch` throws `AppError` on any non-ok response:

```ts
class AppError extends Error {
  code: string; // backend ErrorCode (e.g. "BAD_REQUEST", "CONFLICT")
  status: number; // HTTP status
}
```

TanStack Query mutations expose the error via `mutation.error`. Use `error instanceof AppError` to branch on specific codes.
