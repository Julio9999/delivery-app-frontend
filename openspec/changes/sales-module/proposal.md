# Proposal: Sales Module

## Intent

The admin panel has no way to register or view sales. Users must go outside the system to track orders. This adds the sales management UI matching the existing backend `/sales` API, following the same patterns as products/categories/offers modules.

## Scope

### In Scope
- Sale listing page (DataTable, paginated, filterable by date/product)
- Read-only sale detail page (items, totals, metadata — no edit/delete)
- Sidebar nav entry under "Ventas"
- API layer: interfaces, client calls for GET /sales (create endpoint exists but is NOT exposed in the admin panel — sales are created only by the customer app)

### Out of Scope
- Update or delete sales (backend has no endpoints — immutable by design)
- Stock management UI (handled by existing product stock display)
- Invoice/receipt generation
- Role-based access or multi-user sale scoping

## Capabilities

> No existing specs in `openspec/specs/`. All capabilities are new.

### New Capabilities
- `sales-listing`: Paginated, filterable list of all sales with date range and product filters
- `sale-detail`: Read-only view of a single sale showing items, quantities, unit prices, subtotals, and total

### Modified Capabilities

None.

## Approach

- **API layer**: `src/api/interfaces/sale.ts` (interfaces) + `src/api/sales/sales.ts` (client calls), using existing `plubClient`
- **Store**: Add `sales` DataTable store to `src/stores/main-store.ts` + selector hook
- **Pages**: `src/pages/sales/` — MainPage (list), DetailPage (read-only)
- **Modules**: `src/modules/sales/` — hooks, components following product module pattern
- **Routing**: Add `/sales`, `/sales/:id` routes in `App.tsx` under `ProtectedLayout`
- **Nav**: Add "Ventas" nav item with `ShoppingCartIcon` in `protected-layout.tsx`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/api/interfaces/sale.ts` | New | Sale, SaleItem interfaces |
| `src/api/sales/sales.ts` | New | getAll API call (create exists for customer app, not exposed in admin) |
| `src/stores/main-store.ts` | Modified | Add `sales` DataTable store + selector |
| `src/pages/sales/` | New | MainPage, DetailPage + index |
| `src/modules/sales/` | New | hooks, components (detail) |
| `src/App.tsx` | Modified | Add `/sales`, `/sales/:id` routes |
| `src/components/layouts/protected-layout.tsx` | Modified | Add "Ventas" sidebar item |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend pagination schema differs from frontend expectation | Low | Typed return matches existing `PaginatedResult` pattern |

## Rollback Plan

1. Revert `App.tsx` routes and sidebar nav item
2. Delete `src/pages/sales/` and `src/modules/sales/` directories
3. Remove `sales` store from `main-store.ts`
4. Delete `src/api/interfaces/sale.ts` and `src/api/sales/sales.ts`
5. To restore create-sale: revert the removal of create-sale.tsx, use-create-sale.ts, product-search.tsx, cart-items.tsx, and re-add `/sales/create` route

## Dependencies

- Backend `GET /sales` and `POST /sales` endpoints (already exist)
- Product search endpoint `GET /products/search` (already wired in `searchApi`)

## Success Criteria

- [x] `GET /sales` returns paginated data rendered in DataTable with working filters
- [x] Sale detail page shows all items, prices, and totals read-only
- [x] Nav item "Ventas" visible with correct routing
- [x] `bun run build` passes with no type errors
- [ ] Create sale is NOT exposed in the admin panel — no `/sales/create` route, no "Registrar venta" button
