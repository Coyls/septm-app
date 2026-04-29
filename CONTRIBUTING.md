# Contributing

## Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [pnpm](https://pnpm.io/) v10+
- A running instance of [septm-backend](https://github.com/coyls/septm-backend)

## Local setup

```bash
# Install dependencies
pnpm install

# Copy the environment template and fill in the values
cp .env.example .env.local

# Start the dev server
pnpm run dev
```

The app is available at `http://localhost:3001`.

## Code style

```bash
pnpm run lint          # lint and auto-fix
```

## Commit convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Use `pnpm dlx cz` (Commitizen) for an interactive prompt.

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Opening a pull request

1. Fork the repo and create a branch from `develop`
2. Make your changes
3. Ensure lint passes
4. Open a PR against `develop` — not `main`
5. Describe what the PR does and why
