# Tasks: Build Version Display

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~70 (incl. README) |
| 400-line budget risk | **Low** |
| Chained PRs recommended | **No** |
| Suggested split | **Single PR** |
| Delivery strategy | `ask-on-risk` |
| Chain strategy | N/A |
| Decision needed before apply | No |

> Forecast is well under the 400-line review budget. A single PR is appropriate. No chained PR split required.

## Conventions

- Each task is completable in one focused session.
- Tasks are grouped into phases: **1. Foundation** → **2. UI Mount** → **3. Docs** → **4. Verify**.
- Run `bun run lint` and `bun run build` after Phase 2 to validate TS strict + bundle.
- All paths are relative to the repo root `D:\delivery-app\panel-administrativo`.

---

## Phase 1 — Foundation (Build-Time Injection)

### ✅ 1.1 Update `vite.config.ts` to inject `__APP_VERSION__`

- Add `import { execSync } from "node:child_process";` and `import pkg from "./package.json" with { type: "json" };` to the top of the file.
- Convert the default export from an object literal to a function `defineConfig(() => { ... })`.
- Define a local `getGitShortSha(): string` helper that wraps `execSync("git rev-parse --short HEAD", ...)` in try/catch and returns `"unknown"` on failure.
- Compute `appVersion = \`v${pkg.version} (${shortSha}) - ${builtAt}\`` where `builtAt = new Date().toISOString()`.
- Add `define: { __APP_VERSION__: JSON.stringify(appVersion) }` to the returned config object.
- Keep all existing `plugins` and `resolve.alias` entries unchanged.

**Acceptance**:

- `bun run build` succeeds.
- Grepping the emitted bundle under `dist/` for `__APP_VERSION__` shows the literal string `v0.0.1 (a1b2c3d) - 2026-07-...` (or equivalent with the real SHA and timestamp).

### ✅ 1.2 Add `src/vite-env.d.ts` with global declaration

- Create the file with the following content:

  ```typescript
  /// <reference types="vite/client" />

  declare const __APP_VERSION__: string;
  ```

**Acceptance**:

- `tsc -b` and `bun run lint` pass with no `no-undef` or TS2304 errors for `__APP_VERSION__`.

---

## Phase 2 — UI Mount

### ✅ 2.1 Create `src/components/layouts/build-version-badge.tsx`

- New file exporting a named function `BuildVersionBadge`.
- Renders a `<div>` with classes: `mt-3 text-center font-mono text-[10px] text-white/50 select-all`.
- Children: `{__APP_VERSION__}`.
- `title` attribute: `{__APP_VERSION__}` (so hovering shows the same value in a native tooltip).

**Acceptance**:

- File compiles under TypeScript strict.
- Default export is **not** used; use named export (consistent with `SidebarNavItem` pattern).

### ✅ 2.2 Mount `<BuildVersionBadge />` in `Sidebar.tsx`

- Add `import { BuildVersionBadge } from "./build-version-badge";` at the top of `src/components/layouts/Sidebar.tsx`.
- Inside the bottom wrapper `<div className="border-t border-white/10 p-4">`, after the existing logout `<button>`, add `<BuildVersionBadge />`.

**Acceptance**:

- The badge is visible in both the desktop sidebar and the mobile sheet (they share the same `Sidebar` component).
- Existing sidebar layout is unchanged: nav items, collapse toggle, and logout button behave as before.

### ✅ 2.3 Validate build + lint

- Run `bun run lint` — must pass with zero errors.
- Run `bun run build` — must produce `dist/` without TypeScript errors.

**Acceptance**:

- Both commands exit 0.
- No new warnings introduced.

---

## Phase 3 — Documentation

### ✅ 3.1 Update `README.md` with a "Build info" section

- Add a short section (3–5 lines) explaining:
  - The badge shows `v{package.json version} ({git short SHA}) - {ISO build timestamp}`.
  - The SHA is read from the local git repo at build time; if git is unavailable, the SHA portion shows `unknown`.
  - The constant is injected at build time, not at runtime.

**Acceptance**:

- README renders correctly (Markdown lint / preview OK).
- Section does not duplicate info already documented elsewhere.

---

## Phase 4 — Verify

### 4.1 Manual smoke check

- Run `bun run dev`, open the panel, log in, and confirm the badge appears at the bottom of the sidebar with a value matching the format `v0.0.1 (<sha>) - <isoTimestamp>`.
- Resize the window below 768px, open the mobile sheet, and confirm the same value is rendered.
- Triple-click the badge text and confirm the whole string is selected (proves `select-all` works).

### 4.2 `sdd-verify` (delegated)

- Run the SDD verification sub-agent against the spec scenarios (`build-version-display/spec.md`).
- Expected verdict: **PASS**.
- Address any CRITICAL findings before opening the PR.

---

## Out-of-Scope Tasks (deferred)

- Click-to-copy with `navigator.clipboard.writeText`.
- Tinting the badge red in production.
- Public `/version` health endpoint.
- Showing the badge on the `/login` page.
