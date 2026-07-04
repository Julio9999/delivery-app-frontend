# Tasks: Responsive Admin Panel

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~260 (incl. generated sheet.tsx) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All responsive changes | Single PR | ~260 lines, well under 400-line budget; generated sheet.tsx is standard shadcn output |

## Phase 1: Foundation

- [x] 1.1 Create `src/hooks/use-media-query.ts` — SSR-safe hook wrapping `window.matchMedia`; returns `false` during SSR, updates reactively via `change` event listener with cleanup. (REQ-001)
- [x] 1.2 Install shadcn Sheet component — run `bunx shadcn@latest add sheet`, producing `src/components/ui/sheet.tsx`. (REQ-002, REQ-006)

## Phase 2: Layout Shell

- [x] 2.1 Modify `src/components/layouts/SidebarNavItem.tsx` — add optional `onNavigate?: () => void` prop; invoke it inside the `<Link>` `onClick` handler. (REQ-002)
- [x] 2.2 Modify `src/components/layouts/Sidebar.tsx` — add optional `onNavigate?: () => void` prop; pass it to each `SidebarNavItem`; when `onNavigate` is provided (mobile Sheet context), force `isExpanded=true` and hide the toggle button. (REQ-002, REQ-003)
- [x] 2.3 Modify `src/components/layouts/protected-layout.tsx` — import `useMediaQuery` and Sheet components; add `isDesktop` via `useMediaQuery("(min-width: 768px)")`; add `mobileSheetOpen` state; render Sidebar inside `Sheet(side="left")` on mobile with hamburger in `#layout-page-title`; render existing grid layout on desktop; pass `onNavigate={() => setMobileSheetOpen(false)}` to mobile Sidebar. (REQ-002, REQ-003)

## Phase 3: Content Responsiveness

- [x] 3.1 Modify `src/modules/products/components/product-form.tsx`, `src/modules/categories/components/category-form.tsx`, `src/modules/offers/components/offer-form.tsx` — replace `w-200` with `max-w-200 w-full` on the Card className. (REQ-004)
- [x] 3.2 Modify `src/components/common/data-table/data-table-base.tsx` — change outer wrapper `overflow-hidden` to `overflow-x-auto`; change pagination container from `w-xs` to `max-w-xs w-full`. (REQ-005, REQ-008)
- [x] 3.3 Modify `src/components/common/data-table/data-table.tsx` — import `useMediaQuery`; compute `isMobile`; set `defaultColumn.enableResizing: !isMobile` in `useReactTable` config. (REQ-005)
- [x] 3.4 Modify `src/components/common/side-filters/side-filters-panel.tsx` — import `useMediaQuery`; on mobile render filter content inside `Sheet(side="right")` with a floating trigger button; on desktop keep existing inline `<aside w-72>` rendering. (REQ-006)
- [x] 3.5 Modify `src/components/common/date-picker/date-picker.tsx` — import `useMediaQuery`; set `numberOfMonths={isDesktop ? 2 : 1}` on the range Calendar component. (REQ-007)

## Phase 4: Verification

- [x] 4.1 Run `bun run build` — verify zero build errors. (REQ-008)
- [x] 4.2 Run `tsc -b` — verify zero type errors.
- [x] 4.3 Run `bun run lint` — verify zero lint errors.
- [ ] 4.4 Manual check at 375px and 320px — verify sidebar drawer opens/closes, forms fit viewport, tables scroll horizontally, filters open in Sheet, date picker shows single month, no horizontal scrollbar anywhere. (REQ-001 through REQ-008)
- [ ] 4.5 Manual check at 1280px — verify no desktop regression: inline sidebar toggle, two-month date picker, inline filters, column resize works.
