# Tasks: Sales Module

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~640 → ~360 (after create-sale removal) |
| 400-line budget risk | Low (after scope reduction) |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + List → PR 2: Detail |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

> **Scope change (2026-06-05)**: Create sale flow removed from admin panel. Only the customer app creates sales. Admin panel is read-only for sales: list + detail.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Interfaces + API client + Store + List page + nav + route | PR 1 | ~280 lines; base = feature/tracker branch |
| 2 | Detail page — cache read, sale-info, route | PR 2 | ~80 lines; base = PR#1 branch |

## Phase 1: Foundation

- [x] 1.1 Create `src/api/interfaces/sale.ts` — SaleListItem, SaleItem, SaleDetail, CreateSalePayload, SalesListParams
- [x] 1.2 Create `src/api/sales/sales.ts` — `getAll(params)` + `create(payload)` via plubClient
- [x] 1.3 Modify `src/stores/main-store.ts` — add `sales` DataTableStore + `useSalesStoreState` selector
- [x] 1.4 Create `src/pages/sales/index.ts` — barrel exports for main/detail/create pages

## Phase 2: Listing

- [x] 2.1 Create `src/modules/sales/hooks/use-sales-main-page.ts` — columns (id/total/itemCount/createdAt), side filters (from/to/productId), goToCreateSale, "Ver detalle" action
- [x] 2.2 Create `src/pages/sales/main-sales-page.tsx` — DataTable wrapper with PageTitlePortal + buttons + side filters
- [x] 2.3 Modify `src/components/layouts/protected-layout.tsx` — import `ShoppingCartIcon`, add "Ventas" nav item
- [x] 2.4 Modify `src/App.tsx` — add `/sales` route, import MainSalesPage

~~## Phase 3: Create Sale Flow (REMOVED 2026-06-05)~~

> The admin panel does NOT expose sale creation. Only the customer app creates sales.
> All create-sale files have been deleted and the `/sales/create` route removed.

- ~~[ ] 3.1 Create `src/modules/sales/components/product-search.tsx`~~ — **REMOVED**
- ~~[ ] 3.2 Create `src/modules/sales/components/cart-items.tsx`~~ — **REMOVED**
- ~~[ ] 3.3 Create `src/modules/sales/hooks/use-create-sale.ts`~~ — **REMOVED**
- ~~[ ] 3.4 Create `src/pages/sales/create-sale.tsx`~~ — **REMOVED**
- ~~[ ] 3.5 Modify `src/App.tsx` — add `/sales/create` route~~ — **REMOVED**

## Phase 4: Detail Page

- [x] 4.1 Create `src/modules/sales/components/sale-info.tsx` — read-only metadata display: id, date, total, items table
- [x] 4.2 Create `src/modules/sales/hooks/use-sale-detail.ts` — load from POST cache (sessionStorage) or list fallback
- [x] 4.3 Create `src/pages/sales/detail-sale.tsx` — page wrapper composing hook + sale-info; loading/not-found states
- [x] 4.4 Modify `src/App.tsx` — add `/sales/:id` route

## Phase 5: Verify

- [x] 5.1 Run `tsc -b` — ✅ Build passes
- [x] 5.2 Run `bun run lint` — ✅ No new lint issues (pre-existing errors unrelated)
- [ ] 5.3 Manual: load `/sales`, paginate, apply date/product filters (pending user)
- [ ] 5.5 Manual: verify cached POST data renders on `/sales/:id` (pending user)
- [x] 5.6 Scope check: `/sales/create` route removed, "Registrar venta" button removed, create-sale files deleted, build passes without them ✅
