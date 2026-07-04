# Proposal: Build Version Display

## Intent

Operators and developers need to know, at a glance, **which exact build is currently deployed** in any environment (local dev, staging, production). Today the panel has no way to surface the running build, which makes incident triage, A/B comparisons, and "is the latest PR live?" questions blind.

This change adds a small, always-visible build version badge to the authenticated layout of the panel.

## Scope

### In

- Inject a build-time constant `__APP_VERSION__` (semantic version + short git SHA + ISO build timestamp) into the Vite bundle.
- Render that constant as a small, low-emphasis badge inside the sidebar (visible in both desktop and mobile-sheet modes).
- Provide TypeScript typing for the global constant.
- Document the build-info format in the README.

### Out

- Click-to-copy behavior (can be added later as a follow-up if requested).
- Server-side `/version` endpoint or runtime health probe.
- Showing the version on the public `/login` page (auth-gated view only).
- Per-environment styling (e.g., red badge in production). One consistent style only.

## Approach

1. **`vite.config.ts`** — compute the build info at config time from:
   - `package.json` version (already `0.0.1`)
   - `git rev-parse --short HEAD` (fallback to `unknown` if git is unavailable)
   - `new Date().toISOString()` for the build timestamp
   - Inject the result as a `define` global: `__APP_VERSION__ = JSON.stringify("v0.0.1 (a1b2c3d) - 2026-07-04T20:30:00.000Z")`.
2. **`src/vite-env.d.ts`** — declare `const __APP_VERSION__: string` so TypeScript and ESLint are happy.
3. **`src/components/layouts/build-version-badge.tsx`** — new tiny component, ~10 lines, renders the constant with a `title` tooltip containing the same string. Uses `font-mono` and low opacity to stay unobtrusive.
4. **`src/components/layouts/Sidebar.tsx`** — mount the badge in the bottom section, below the logout button. This automatically makes it visible in both desktop and mobile-sheet renders (the sidebar is the same component in both).
5. **`README.md`** — short section explaining the build-info format and how the SHA is sourced.

## Affected Files

| File | Change |
|---|---|
| `vite.config.ts` | Add `execSync` for git SHA + `define` block |
| `src/vite-env.d.ts` | (new) Declare `__APP_VERSION__` |
| `src/components/layouts/build-version-badge.tsx` | (new) Badge component |
| `src/components/layouts/Sidebar.tsx` | Mount the badge |
| `README.md` | Document build-info format |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Build fails in environments without `git` (e.g., some CI containers) | Low | `execSync` wrapped in `try/catch` falling back to `unknown` |
| Bundle bloat from inlining a long ISO timestamp | Negligible | Timestamp is ~25 bytes; well within budget |
| Badge clutters the sidebar | Low | Small text (`text-[10px]`), low opacity (`text-white/50`), no icon |

## Rollback Plan

Revert the single PR. The badge is purely additive — no API contract, no DB migration, no env var required. Reverting removes the badge and stops the `define` injection in the same commit.

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~70 (incl. README) |
| 400-line budget risk | **Low** |
| Chained PRs recommended | **No** |
| Suggested split | Single PR |
| Delivery strategy | `ask-on-risk` (user chose C1) |
| Chain strategy | N/A |
