# Design: Responsive Admin Panel

## Technical Approach

Add responsive behavior to the admin panel using a single breakpoint (768px) via a `useMediaQuery` hook. Mobile (< 768px) gets a Sheet-based sidebar drawer, fluid forms, scrollable tables, and drawer-based filters. Desktop (≥ 768px) remains unchanged. All changes are CSS/class-level and conditional rendering — no new state management libraries, no backend changes.

## Architecture Decisions

### Decision: Single `useMediaQuery` hook over CSS-only responsive

| Option | Tradeoff | Decision |
|--------|----------|----------|
| CSS media queries only | No conditional rendering (Sheet vs inline), can't disable column resize | Rejected |
| `useMediaQuery` hook | Lightweight, SSR-safe, enables conditional rendering | **Chosen** |
| `useBreakpoint` library | Extra dependency for a single breakpoint | Rejected |

**Rationale**: The spec requires conditional component trees (Sheet vs inline sidebar, Sheet vs inline filters), which CSS alone cannot achieve. A 15-line hook wrapping `window.matchMedia` is sufficient.

### Decision: Sidebar state — local `useState` over Zustand store

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Zustand store | Overkill for one boolean, adds a store file | Rejected |
| Local `useState` in `ProtectedLayout` | Simple, co-located with layout, lifted to parent | **Chosen** |
| React Context | Unnecessary indirection for single consumer | Rejected |

**Rationale**: The sidebar open/close state is only consumed by `ProtectedLayout` and its direct children. A `useState<boolean>` in `ProtectedLayout` with a `mobileSheetOpen` / `setMobileSheetOpen` pair is the simplest correct solution. The `onNavigate` callback passed to `Sidebar` closes the Sheet on link click.

### Decision: Sheet side = "left" for sidebar, "right" for filters

**Rationale**: Sidebar is left-anchored in the desktop layout; filters are right-anchored conceptually (they appear to the left of the table). Matching Sheet slide direction to spatial position reduces cognitive dissonance.

### Decision: Disable column resize on mobile via `enableResizing: false`

**Rationale**: TanStack Table's `onTouchStart` resize handler conflicts with horizontal scroll gestures. On mobile, we pass `enableResizing: false` to the table's `defaultColumn` config when `isMobile` is true. This is a prop-level change, not a CSS change.

## Data Flow

```
ProtectedLayout
├── useMediaQuery("(min-width: 768px)") → isDesktop
├── useState(mobileSheetOpen)
│
├── [mobile] Sheet(open=mobileSheetOpen, side="left")
│   └── Sidebar(onNavigate → setMobileSheetOpen(false))
│
├── [desktop] Sidebar (inline, existing toggle behavior)
│
└── <main>
    ├── [mobile] HamburgerButton → setMobileSheetOpen(true)
    └── <Outlet />
        ├── DataTable
        │   ├── useMediaQuery → isMobile
        │   ├── SideFiltersPanel
        │   │   ├── [mobile] Sheet(side="right") + floating trigger
        │   │   └── [desktop] inline <aside w-72>
        │   └── DataTableBase
        │       ├── [mobile] overflow-x-auto, resize disabled
        │       └── [desktop] overflow-hidden, resize enabled
        └── Forms (product/category/offer)
            └── Card: max-w-200 w-full (no conditional)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/use-media-query.ts` | Create | `useMediaQuery(query)` hook — SSR-safe `matchMedia` wrapper |
| `src/components/ui/sheet.tsx` | Create | shadcn Sheet component via `bunx shadcn@latest add sheet` |
| `src/components/layouts/protected-layout.tsx` | Modify | Add `useMediaQuery`, `mobileSheetOpen` state, Sheet wrapper for mobile sidebar, hamburger button in `#layout-page-title` |
| `src/components/layouts/Sidebar.tsx` | Modify | Accept optional `onNavigate` callback; call it after nav link click; always expanded when inside Sheet |
| `src/components/layouts/SidebarNavItem.tsx` | Modify | Accept optional `onNavigate` callback; invoke on `<Link>` click |
| `src/components/common/data-table/data-table.tsx` | Modify | Pass `isMobile` to `DataTableBase`; set `enableResizing: !isMobile` on `defaultColumn` |
| `src/components/common/data-table/data-table-base.tsx` | Modify | `overflow-hidden` → `overflow-x-auto` on outer wrapper; pagination `w-xs` → `max-w-xs w-full` |
| `src/components/common/side-filters/side-filters-panel.tsx` | Modify | Conditional render: Sheet on mobile, inline `<aside>` on desktop; add floating filter trigger button for mobile |
| `src/modules/products/components/product-form.tsx` | Modify | `w-200` → `max-w-200 w-full` on Card |
| `src/modules/categories/components/category-form.tsx` | Modify | `w-200` → `max-w-200 w-full` on Card |
| `src/modules/offers/components/offer-form.tsx` | Modify | `w-200` → `max-w-200 w-full` on Card |
| `src/components/common/date-picker/date-picker.tsx` | Modify | Import `useMediaQuery`; `numberOfMonths={isDesktop ? 2 : 1}` |

## Interfaces / Contracts

### useMediaQuery hook

```ts
/**
 * SSR-safe media query hook.
 * Returns false during SSR/initial hydration, then updates reactively.
 */
export function useMediaQuery(query: string): boolean
```

### Sidebar props extension

```ts
interface SidebarProps {
  // ... existing props
  onNavigate?: () => void;  // NEW: called when a nav link is clicked
}
```

### SidebarNavItem props extension

```ts
interface SidebarNavItemProps {
  // ... existing props
  onNavigate?: () => void;  // NEW: propagated from Sidebar
}
```

### ProtectedLayout mobile state

```ts
// Inside ProtectedLayout component:
const isDesktop = useMediaQuery("(min-width: 768px)");
const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
```

## Tailwind Breakpoint Strategy

Single breakpoint at **768px** (`md:` in Tailwind). The approach is **not** to use responsive utility classes for the layout shell (because we need conditional component trees), but to use `useMediaQuery("(min-width: 768px)")` for JavaScript-level branching.

For pure CSS changes (form widths, pagination), we use `max-w-*` + `w-full` which works at all breakpoints without media queries.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Zero build errors | `bun run build` |
| Type check | No type errors | `tsc -b` |
| Lint | No lint errors | `bun run lint` |
| Manual | Mobile viewport (375px, 320px) | Chrome DevTools device emulation |
| Manual | Desktop viewport (1280px) | Verify no regression |

No automated test runner is configured in this project.

## Migration / Rollout

No migration required. All changes are client-side CSS and conditional rendering. No database, API, or configuration changes.

**Rollback**: `git revert` the responsive-app commit(s). Sheet component can be removed via `bunx shadcn@latest remove sheet` if unused.

## Open Questions

- None
