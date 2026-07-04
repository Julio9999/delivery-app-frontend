# Responsive Layout Specification

## Purpose

Defines responsive behavior for the admin panel across mobile (< 768px) and desktop (>= 768px) viewports. Covers sidebar drawer navigation, fluid form layouts, scrollable tables, drawer-based filters, responsive date picker, and mobile polish.

## Requirements

### REQ-001: Breakpoint Detection Hook

The system MUST provide a `useMediaQuery(query: string)` hook that returns a boolean reflecting the current viewport match state. The hook MUST return `false` during SSR/hydration and update reactively on resize.

#### Scenario: Mobile detection

- GIVEN a viewport width of 375px
- WHEN `useMediaQuery("(min-width: 768px)")` is called
- THEN it returns `false`

#### Scenario: Desktop detection

- GIVEN a viewport width of 1024px
- WHEN `useMediaQuery("(min-width: 768px)")` is called
- THEN it returns `true`

### REQ-002: Mobile Sidebar Drawer

The system MUST render the sidebar inside a Sheet drawer on mobile. The Sheet MUST be triggered by a hamburger button in the page-title bar. The Sheet MUST close when a navigation link is clicked.

#### Scenario: Open sidebar on mobile

- GIVEN viewport < 768px
- WHEN the hamburger button is tapped
- THEN the sidebar Sheet slides in from the left

#### Scenario: Auto-close on navigation

- GIVEN the sidebar Sheet is open on mobile
- WHEN a navigation link is clicked
- THEN the Sheet closes and navigation occurs

### REQ-003: Responsive Layout Shell

The system MUST render a single-column layout on mobile (no grid). The system MUST render `grid-cols-[auto_1fr]` on desktop with an inline sidebar toggle. The collapsed icon-only sidebar state MUST NOT appear on mobile.

#### Scenario: Mobile layout

- GIVEN viewport < 768px
- WHEN any protected page loads
- THEN content renders full-width with no sidebar visible

#### Scenario: Desktop layout preserved

- GIVEN viewport >= 768px
- WHEN any protected page loads
- THEN the existing grid layout with toggleable sidebar renders unchanged

### REQ-004: Fluid Form Cards

Form containers in product-form, category-form, and offer-form MUST use `max-w-200 w-full` instead of `w-200`. Forms MUST fit within a 320px viewport without horizontal overflow.

#### Scenario: Form on mobile

- GIVEN viewport width of 320px
- WHEN a form page loads
- THEN the form card fits within the viewport with no horizontal scrollbar

#### Scenario: Form on desktop

- GIVEN viewport width of 1280px
- WHEN a form page loads
- THEN the form card renders at its max-width (800px) centered

### REQ-005: Scrollable Data Tables

The data table outer wrapper MUST use `overflow-x-auto` instead of `overflow-hidden`. Table content MUST be horizontally scrollable on mobile without clipping. Column resize MUST be disabled on mobile.

#### Scenario: Wide table on mobile

- GIVEN a table with columns exceeding viewport width
- WHEN rendered on viewport < 768px
- THEN the table scrolls horizontally and no content is clipped

### REQ-006: Drawer-Based Side Filters

The side filters panel MUST render inside a Sheet on mobile with a floating trigger button. The panel MUST render inline (`w-72`) on desktop unchanged.

#### Scenario: Open filters on mobile

- GIVEN viewport < 768px and filters are available
- WHEN the floating filter button is tapped
- THEN filters open in a Sheet drawer

#### Scenario: Filters on desktop

- GIVEN viewport >= 768px
- WHEN a page with filters loads
- THEN filters render inline as before

### REQ-007: Responsive Date Picker

The date picker MUST show `numberOfMonths={1}` on mobile and `numberOfMonths={2}` on desktop, determined by `useMediaQuery`.

#### Scenario: Date picker on mobile

- GIVEN viewport < 768px
- WHEN the date picker opens
- THEN a single month calendar is displayed

### REQ-008: Mobile Polish

Pagination containers MUST use `max-w-xs w-full` instead of `w-xs`. Interactive touch targets MUST be at least 44px. The `bun run build` command MUST pass with zero errors.

#### Scenario: Pagination on small viewport

- GIVEN viewport width of 320px
- WHEN a paginated table renders
- THEN pagination controls fit without overflow

#### Scenario: Build verification

- GIVEN all responsive changes are applied
- WHEN `bun run build` is executed
- THEN the build completes with zero errors
