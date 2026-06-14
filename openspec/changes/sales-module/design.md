# Design: Sales Module

## Technical Approach

Follow existing product/category/offer module patterns (DataTable store, hooks, API client, page wrappers) but adapt for three new flows: filterable paginated list, cart-based creation (no react-hook-form), and read-only detail. Sales are immutable — no edit/delete actions.

## Architecture Decisions

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Cart state management | Zustand, URL params, local state | **Local `useState`** | Cart is ephemeral per-session, no cross-component sharing needed. Avoids store pollution. |
| Sale detail data source | POST response cache, GET /sales/:id, list data | **POST response (sessionStorage) + list metadata fallback** | No backend `GET /sales/:id` exists. POST returns full detail; cache it. For historical, show list fields only. |
| Date range filter | Custom date-range picker, two `date` filters | **Two side filters (`from`, `to`)** | Side filter panel already supports `date` type — reuse it. No custom components needed. |
| Product search for cart | Single endpoint with full data | **`searchApi.searchProducts` + `productsApi.getById` on selection** | Search API returns only `{id, label}`. Fetch full price/stock via getById after user selects. |
| Detail route after creation | Navigate with state, query param, cached ID | **Navigate with `state` + sessionStorage** | Survives refresh via sessionStorage; `navigate('/sales/:id', { state })` for instant render. |

## Data Flow

```
┌─ SALES LIST ─────────────────────────────────────┐
│ useSalesMainPage hook → salesApi.getAll(params)   │
│   ↑ store sales.columns, sales.filters, fetcher   │
│   ↓ DataTable renders with pagination/filters     │
│     Side filters: from (date), to (date),         │
│       productId (async-select via searchApi)       │
│     Actions: "Ver detalle" → navigate /sales/:id  │
└──────────────────────────────────────────────────┘

┌─ SALE DETAIL ────────────────────────────────────┐
│ useSaleDetail hook:                               │
│   if POST cache in sessionStorage → render full   │
│   else → show metadata from list + items pending  │
│   Read-only: no edit/delete controls              │
└──────────────────────────────────────────────────┘
```

> **Note**: Sale creation is NOT available in the admin panel. Only the customer app can create sales. The `POST /sales` API endpoint is exposed for backend/customer use only — the admin panel has no create-sale UI, route, or components.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/api/interfaces/sale.ts` | Create | Sale, SaleItem, CreateSalePayload types |
| `src/api/sales/sales.ts` | Create | `getAll(params)` using plubClient (`create()` exists for customer app, not used in admin) |
| `src/stores/main-store.ts` | Modify | Add `sales` DataTableStore + `useSalesStoreState` selector |
| `src/pages/sales/index.ts` | Create | Barrel exports |
| `src/pages/sales/main-sales-page.tsx` | Create | List page wrapper → DataTable |
| `src/pages/sales/detail-sale.tsx` | Create | Read-only detail page |
| `src/modules/sales/hooks/use-sales-main-page.ts` | Create | Columns, fetcher, filters, actions for list |
| `src/modules/sales/hooks/use-sale-detail.ts` | Create | Load detail from cache or list data |
| `src/modules/sales/components/sale-info.tsx` | Create | Read-only sale metadata display |
| `src/App.tsx` | Modify | Add `/sales`, `/sales/:id` routes |
| `src/components/layouts/protected-layout.tsx` | Modify | Add "Ventas" nav item with `ShoppingCartIcon` |

## Interfaces / Contracts

```typescript
// src/api/interfaces/sale.ts
export interface SaleListItem {
  id: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleDetail extends SaleListItem {
  items: SaleItem[];
}

export interface CreateSalePayload {
  items: { productId: string; quantity: number; unitPrice: number }[];
}

// Sales list API params
export interface SalesListParams {
  page?: number;
  pageSize?: number;
  from?: string;    // ISO date
  to?: string;      // ISO date
  productId?: string;
}

// DataTable filters (used via createDataTableStore generic)
interface SalesFilters {
  from?: string;
  to?: string;
  productId?: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | TypeScript compilation | `tsc -b` — no type errors |
| Lint | Code quality | `bun run lint` passes |
| Manual | List page load, pagination, filters | Load `/sales`, verify DataTable renders, paginate, apply date/product filters |
| Manual | Detail view after creation | Verify cached POST data renders on detail page |
| Manual | Error states: empty list, validation errors | Verify empty state display |

No automated test runner exists in the project (confirmed in `openspec/config.yaml`).

## Migration / Rollout

No migration required. All new files, no existing data changes.

## Open Questions

- [ ] **Backend GET /sales/:id**: Missing endpoint. Detail page can only show full items for recently created sales (via POST cache). Historical sales show list metadata only. Needs backend work for full historical detail.
- [ ] **productId filter on GET /sales**: Confirm backend supports `?productId=` query param on the list endpoint. If not, remove the async-select side filter.
