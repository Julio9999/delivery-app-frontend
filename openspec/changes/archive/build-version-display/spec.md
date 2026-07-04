# Build Version Display — Specification

## Purpose

The system SHALL surface, in every authenticated view of the panel, the exact build of the JavaScript bundle currently running in the browser. The information SHALL be sufficient to identify the deployed commit and when that bundle was produced.

## Requirements

### Requirement: Build Info Injection

The Vite build pipeline SHALL inject a string constant named `__APP_VERSION__` into every client bundle produced by `bun run build` and `bun run dev`.

The value of `__APP_VERSION__` SHALL follow this exact format:

```
v{semver} ({shortSha}) - {isoTimestamp}
```

Where:

- `{semver}` is the value of the `version` field in `package.json` at build time.
- `{shortSha}` is the output of `git rev-parse --short HEAD` at build time, or the literal string `unknown` if git is unavailable or fails.
- `{isoTimestamp}` is `new Date().toISOString()` evaluated at build time.

#### Scenario: Production build with clean git repo

- **Given** the repository is a git working copy and `package.json` has `version: "0.0.1"`
- **When** `bun run build` is executed on commit `a1b2c3d`
- **Then** every emitted client bundle contains a constant equivalent to:
  `__APP_VERSION__ = "v0.0.1 (a1b2c3d) - 2026-07-04T20:30:00.000Z"`

#### Scenario: Build inside an environment without git

- **Given** the `git` binary is not on `$PATH` or the working copy is not a git repo
- **When** `bun run build` is executed
- **Then** `{shortSha}` in the injected constant is `unknown`
- **And** the build still completes successfully

### Requirement: Always-Visible Badge in Authenticated Layout

The application SHALL display the value of `__APP_VERSION__` as a text badge inside the sidebar of `ProtectedLayout`, in both desktop layout and mobile sheet layout.

The badge SHALL be visible at all times while the user is authenticated, regardless of the current route.

#### Scenario: Authenticated user lands on any route

- **Given** a user is authenticated
- **When** they navigate to any route under `ProtectedLayout` (desktop viewport)
- **Then** a text badge containing the value of `__APP_VERSION__` is rendered inside the sidebar
- **And** the badge is positioned below the "Cerrar sesión" button

#### Scenario: Mobile user opens the navigation sheet

- **Given** a user is authenticated and the viewport is below 768px wide
- **When** they open the navigation sheet
- **Then** the same text badge containing the value of `__APP_VERSION__` is rendered inside the sheet
- **And** the value matches what the desktop sidebar would show

### Requirement: Non-Interfering Visual Style

The badge SHALL be visually subordinate to primary navigation elements so that it does not distract from operational UI.

Specifically, the badge SHALL:

- Use a monospaced font.
- Use a text size at or below `12px` (CSS `font-size`).
- Use a text color with reduced opacity (Tailwind `text-white/50` or equivalent).
- Not include any interactive elements (no buttons, links, or copy controls).

#### Scenario: Sidebar with badge rendered

- **Given** the sidebar is rendered with the badge mounted
- **When** the user inspects the visual hierarchy
- **Then** the badge text is smaller and less prominent than nav item labels and the "Cerrar sesión" button
