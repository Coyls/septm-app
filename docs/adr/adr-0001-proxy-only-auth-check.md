## ADR-0001: Proxy checks cookie presence only — no server-side token validation

**Status**: Accepted  
**Date**: 2026-04-29

---

## Context

The Next.js middleware (`proxy.ts`) runs on every request and needs to decide whether the user is authenticated. Two approaches were considered:

1. **Check cookie presence only** — if `access_token` or `refresh_token` exists, let the request through.
2. **Validate and refresh the token server-side** — parse the JWT, and if expired, call `POST /auth/refresh` before forwarding the request.

---

## Decision

The proxy checks cookie **presence only**. It does not validate or refresh tokens.

---

## Consequences

- A user with an expired `access_token` but a valid `refresh_token` will pass the proxy and land on the page. `apiFetch` will transparently refresh the token on the first API call (client-side).
- A user whose `refresh_token` is revoked in the database will also pass the proxy. The first API call will return 401, `apiFetch` will attempt a refresh, fail, and redirect to `/auth/signin`.

This means a brief flash of the protected page is possible on expired sessions — acceptable given the trade-off below.

---

## Alternatives

**Server-side refresh in middleware**

- Rejected because it creates a **race condition**: if both the middleware and the first client-side API call attempt to rotate the token simultaneously, one will receive a revoked token and trigger an infinite redirect loop (`dashboard → 401 → signin → redirect → dashboard…`).
- Edge runtime also limits what Node.js APIs are available.

---

## Related

- `src/proxy.ts` — middleware implementation with the rationale in a comment.
- `src/lib/api/fetch.ts` — client-side 401 handling and refresh queuing.
- `src/components/layout/session-gate.tsx` — handles the refresh on auth pages.
