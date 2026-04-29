# septm-app

Next.js 16 (App Router) frontend for septm. **This Next.js version may have breaking changes vs your training data** — check `node_modules/next/dist/docs/` before writing code.

## Stack

TypeScript · pnpm · Tailwind CSS 4 · shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod · Sentry

## Key conventions

- All `/api/v1/*` calls go through the Next.js proxy (see `next.config.ts`) — never call the backend directly
- `(public)/` — unauthenticated routes · `(app)/` — authenticated routes (sidebar layout)
- Page-local components go in `_components/` next to their page — never exported outside
- `ui/` components are shadcn/ui auto-generated — do not hand-edit
- All API functions in `src/lib/api/<domain>.ts` · all TanStack Query hooks in `src/lib/query/hooks/`
- All query keys defined in `src/lib/query/keys.ts`
- Dev server runs on port 3001
- Commits: Conventional Commits (`pnpm dlx cz`)

## Commands

```
pnpm dev        # port 3001
pnpm build
pnpm lint
```

## Docs

- Architecture: `docs/architecture.md`
- API conventions: `docs/api.md`
- ADRs: `docs/adr/`
