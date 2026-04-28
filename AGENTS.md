# septm-app

Next.js frontend for septm. **This Next.js version may have breaking changes vs your training data** — check `node_modules/next/dist/docs/` before writing code.

## Stack
TypeScript · pnpm · Tailwind CSS 4 · shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod

## Key conventions
- All `/api/v1/*` calls go through the Next.js proxy (see `next.config.ts`) — never call the backend directly
- `(public)/` — unauthenticated routes · `(app)/` — authenticated routes
- Dev server runs on port 3001

## Commands
```
pnpm dev        # port 3001
pnpm build
pnpm lint
```
