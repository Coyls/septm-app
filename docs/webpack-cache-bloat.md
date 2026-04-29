# Webpack cache bloat

## Symptom

The dev server (`pnpm dev`) causes the system to freeze or become unresponsive, particularly when navigating to pages that load recharts components for the first time. No error message is shown.

## Cause

The `.next/` directory accumulates webpack build artefacts across dev sessions. The recharts dependency tree (recharts → redux → react-is) is large and has circular references, which amplifies cache growth. Over time the cache can reach several gigabytes, causing heavy I/O + CPU spikes during hot reload.

## Fix

Delete the cache and restart the dev server:

```bash
rm -rf .next
pnpm dev
```

## Prevention

All recharts components must be loaded via `next/dynamic` with `ssr: false` — never as static imports. This isolates recharts from the main webpack compilation and limits cache pressure.

```tsx
const MyChart = dynamic(
  () => import("@/components/statistics/charts/my-chart").then((m) => m.MyChart),
  { ssr: false },
);
```
