# Proposal: Responsive Admin Panel

## Intent

The admin panel is currently unusable on mobile devices (< 768px). The layout grid forces the sidebar to always be visible, form cards have fixed 800px widths, data tables clip content without scrolling, and filter panels take 288px of inline space. This change makes the entire panel functional on mobile by introducing a responsive sidebar drawer, fluid form layouts, horizontal table scrolling, and drawer-based filters.

## Scope

### In Scope
- Layout + Sidebar: Sheet-based drawer on mobile, existing toggle on desktop
- Form cards (×3): Replace `w-200` with `max-w` + `w-full` constraints
- Data table: Horizontal scroll wrapper, remove `overflow-hidden` clipping
- Side filters: Sheet drawer on mobile, inline panel on desktop
- Date picker: Single month on mobile, two months on desktop
- Polish: Pagination `w-xs` overflow, touch targets, padding adjustments
- `useMediaQuery` hook for breakpoint detection
- shadcn Sheet component installation

### Out of Scope
- Tablet-specific optimizations (768–1024px treated as desktop)
- Dark mode or theme changes
- New pages or routes
- Backend API changes

## Capabilities

### New Capabilities
- `responsive-layout`: Mobile drawer navigation, responsive grid shell, and `useMediaQuery` hook for breakpoint-aware rendering

### Modified Capabilities
- None (no existing specs in `openspec/specs/`)

## Approach

1. **Add `useMediaQuery` hook** (`src/hooks/use-media-query.ts`) — wraps `window.matchMedia` with SSR-safe default.
2. **Install shadcn Sheet** — `bunx shadcn@latest add sheet`.
3. **Refactor `protected-layout.tsx`** — conditionally render Sidebar inline (desktop) or inside Sheet (mobile). Add hamburger button in the page-title bar for mobile.
4. **Refactor `Sidebar.tsx`** — accept `onNavigate` callback to close Sheet on link click; remove `w-16` collapsed state on mobile.
5. **Fix form cards** — replace `w-200` with `max-w-200 w-full` in all three form components.
6. **Fix data table** — change outer wrapper from `overflow-hidden` to `overflow-x-auto`; ensure `table-fixed` doesn't prevent horizontal scroll.
7. **Fix side filters** — render inside Sheet on mobile with a floating trigger button; keep inline panel on desktop.
8. **Fix date picker** — use `useMediaQuery` to set `numberOfMonths={1}` on mobile.
9. **Polish** — pagination `max-w-xs w-full`, review padding/gap values, ensure 44px minimum touch targets.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/layouts/protected-layout.tsx` | Modified | Conditional grid layout, Sheet wrapper for sidebar on mobile |
| `src/components/layouts/Sidebar.tsx` | Modified | Accept close callback, remove collapsed-icon mode on mobile |
| `src/components/layouts/SidebarNavItem.tsx` | Modified | Close drawer on navigation |
| `src/hooks/use-media-query.ts` | New | `useMediaQuery(query)` hook |
| `src/components/ui/sheet.tsx` | New | shadcn Sheet component |
| `src/components/common/data-table/data-table-base.tsx` | Modified | `overflow-hidden` → `overflow-x-auto`, pagination `w-xs` fix |
| `src/components/common/side-filters/side-filters-panel.tsx` | Modified | Sheet on mobile, inline on desktop |
| `src/modules/products/components/product-form.tsx` | Modified | `w-200` → `max-w-200 w-full` |
| `src/modules/categories/components/category-form.tsx` | Modified | `w-200` → `max-w-200 w-full` |
| `src/modules/offers/components/offer-form.tsx` | Modified | `w-200` → `max-w-200 w-full` |
| `src/components/common/date-picker/date-picker.tsx` | Modified | `numberOfMonths` responsive to viewport |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TanStack Table column resize breaks on touch | Med | Disable resize on mobile via `useMediaQuery`; re-enable on desktop |
| Radix Popover clips on small screens | Med | Test each popover; switch to Sheet/Dialog on mobile where needed |
| `body { overflow: hidden }` in index.css blocks mobile scroll | Low | Audit and scope overflow rules to layout containers only |

## Rollback Plan

All changes are CSS/class-level modifications and conditional rendering. Revert by:
1. `git revert` the responsive-app commit(s)
2. No database or API changes to undo
3. Sheet component can be removed via `bunx shadcn@latest remove sheet` if unused

## Dependencies

- shadcn Sheet component (`bunx shadcn@latest add sheet`)
- No new npm packages beyond existing shadcn tooling

## Success Criteria

- [ ] Sidebar renders as drawer on screens < 768px, inline toggle on ≥ 768px
- [ ] All three form cards fit within 320px viewport without horizontal overflow
- [ ] Data tables scroll horizontally on mobile without clipping
- [ ] Side filters render as Sheet drawer on mobile
- [ ] Date picker shows single month on mobile
- [ ] No layout shift or horizontal scrollbar on any page at 320px width
- [ ] `bun run build` passes with zero errors
