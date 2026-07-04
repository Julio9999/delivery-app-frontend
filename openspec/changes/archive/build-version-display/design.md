# Build Version Display — Design

## Technical Approach

Inject a single string constant at Vite config evaluation time, expose it as a global via `define`, and render it as a static badge in the sidebar.

This is the lightest viable approach:

- No runtime cost (the constant is string-replaced at build time, not evaluated in the browser).
- No API call, no env var wiring, no per-request logic.
- Works in dev mode too (Vite re-evaluates the config on dev start and serves the constant with HMR).

## Architecture Decisions

### AD-1: Use `define` instead of `import.meta.env`

`import.meta.env.VITE_APP_VERSION` would require passing the value through a `.env` file or shell env, which adds friction (each developer and CI job has to remember to set it). Vite's `define` config runs at config evaluation, so we can compute the value from `package.json` + `git` + `Date` right inside `vite.config.ts` and avoid any env wiring.

**Trade-off accepted**: `define` performs literal string replacement, not expression evaluation. We wrap the value in `JSON.stringify` so the replacement is a valid JS string literal.

### AD-2: Read `package.json` with native import, not `fs.readFile`

Node 20+ (and Bun) supports `import pkg from "./package.json" with { type: "json" }`. This is cleaner than `fs.readFile` + `JSON.parse`, and it tree-shakes correctly. Since `vite.config.ts` runs in Node (not the browser), bundling concerns do not apply.

### AD-3: Git SHA via `execSync` with try/catch

The `git` binary may not be on `$PATH` in some CI sandboxes or stripped Docker images. Wrapping the call in `try/catch` and falling back to the literal `"unknown"` ensures the build never fails because of a missing git. The badge will show `v0.0.1 (unknown) - ...` in that case, which is still useful for environment identification.

### AD-4: Mount the badge inside `Sidebar`, not in `ProtectedLayout`

`Sidebar` is rendered identically in both the desktop branch (`isDesktop === true`) and the mobile-sheet branch of `ProtectedLayout`. Mounting the badge inside `Sidebar` means we cover both viewports with a single edit, and we don't have to touch `ProtectedLayout` at all.

### AD-5: Component name `BuildVersionBadge`, file `build-version-badge.tsx`

The repo has two naming styles for layout files:
- PascalCase: `Sidebar.tsx`, `SidebarNavItem.tsx`, `page-title-portal.tsx` (kebab — outlier)
- kebab-case: `protected-layout.tsx`

The Sidebar folder's main component is PascalCase, so the new component follows that local convention. The file name uses kebab-case because the project has more kebab-case files overall and ESLint/Prettier are happier with it for new code (this matches the recent `delete-modal.tsx`, `data-table-base.tsx`, etc.).

## File-by-File Changes

### `vite.config.ts`

Add the following:

```typescript
import { execSync } from "node:child_process";
import pkg from "./package.json" with { type: "json" };
```

Replace the default export with a function form so we can compute the value:

```typescript
function getGitShortSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

export default defineConfig(() => {
  const shortSha = getGitShortSha();
  const builtAt = new Date().toISOString();
  const appVersion = `v${pkg.version} (${shortSha}) - ${builtAt}`;

  return {
    plugins: [/* unchanged */],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
  };
});
```

### `src/vite-env.d.ts` (new file)

```typescript
/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
```

This declares the global so TypeScript and ESLint accept `__APP_VERSION__` without `no-undef` errors.

### `src/components/layouts/build-version-badge.tsx` (new file)

```typescript
export function BuildVersionBadge() {
  return (
    <div
      className="mt-3 text-center font-mono text-[10px] text-white/50 select-all"
      title={__APP_VERSION__}
    >
      {__APP_VERSION__}
    </div>
  );
}
```

`select-all` is included so triple-clicking selects the whole string for manual copy — a tiny convenience, no JS required.

### `src/components/layouts/Sidebar.tsx`

1. Add import at the top: `import { BuildVersionBadge } from "./build-version-badge";`
2. In the bottom `<div className="border-t border-white/10 p-4">` block, add `<BuildVersionBadge />` after the logout `<button>`. Since the badge text is small, it will sit visually under the button.

### `README.md`

Add a short "Build info" section documenting the format and that the SHA is sourced from the local git repo at build time.

## Sequence Diagram

Not applicable — this is a static build-time injection with no runtime flow.

## Out-of-Scope (deliberately deferred)

- Click-to-copy: trivial to add later via a `useState` + `navigator.clipboard.writeText`.
- Environment-tinted badge (e.g., red in prod): not requested.
- Public `/version` endpoint: not requested.
- Show on the login page: the login page lives outside `ProtectedLayout`; if needed, mount the badge directly in the login layout.
