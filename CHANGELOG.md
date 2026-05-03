# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Scientific calculator for Seven Wonders: computes the optimal score from wheel, compass, and tablet counts with joker distribution using an O(j²) algorithm
- Accessible publicly at `/science-calculator` (public nav) and within the app at `/tools/science-calculator` (sidebar)
- Rename links public navbar and footer (Stats -> Statistiques Global)

### Fixed

- Sign-in page reloading on wrong credentials: auth mutation calls (`signIn`, `signUp`, `verifyEmail`, `forgotPassword`, `resetPassword`) now use `noRedirect: true` so a 401 surfaces as an error to the component instead of triggering the refresh-then-redirect flow
- Session expiry redirect losing the current page: `redirectToSignIn()` now appends `?redirect=<pathname>` so the user is sent back to their original page after re-authenticating (auth pages are excluded to prevent redirect loops)

## [1.0.1] - 2026-04-30

### Hotfix

- Add missing listed public pages in proxy bypass

## [1.0.0] - 2026-04-29

Initial release of the septm frontend.

### Added

**Authentication**

- Sign-up, sign-in, sign-out
- Email verification flow with resend support
- Forgot password and reset password via email link
- Automatic silent token refresh on 401 — concurrent requests are queued to avoid rotation conflicts

**Game**

- 3-step game creation wizard: select extensions → assign players and wonders → confirm
- Score entry page with live leaderboard updated as scores are entered
- Support for registered friends and guest players (email-based)

**Friends**

- Send, accept, reject and cancel friend requests
- Friend list with received and sent request tabs

**Statistics**

- Global statistics page (public, no login required): player rankings, score distribution, wonder and extension performance, monthly trend, competitiveness
- Personal statistics page: same metrics filtered to the authenticated user
- Date range picker for filtering all charts

**Infrastructure**

- Next.js proxy — all `/api/v1/*` requests forwarded to the backend, no direct browser-to-backend calls
- Nonce-based Content Security Policy set per request in production
- Sentry error monitoring with source maps uploaded in CI and browser requests tunneled to avoid ad-blockers

[unreleased]: https://github.com/Coyls/septm-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Coyls/septm-app/releases/tag/v1.0.0
