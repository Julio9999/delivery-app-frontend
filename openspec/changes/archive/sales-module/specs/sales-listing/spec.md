# Sales Listing Specification

## Purpose

Allow authenticated users to browse their sales history in a paginated, filterable DataTable with date range and product filters.

## Requirements

### Requirement: Paginated Sales List

The system MUST display sales in a paginated DataTable ordered by `createdAt` DESC, scoped to the authenticated user.

| Field | Source |
|-------|--------|
| ID | `sale.id` |
| Date | `sale.createdAt` |
| Items | `sale.itemCount` |
| Total | `sale.total` |

#### Scenario: Happy path — load sales page

- GIVEN the user is authenticated and has sales in the system
- WHEN the user navigates to `/sales`
- THEN the system fetches `GET /sales` with default pagination (`page=1, pageSize=10`)
- AND renders a DataTable with sale rows showing total, item count, and date

#### Scenario: Empty state — no sales exist

- GIVEN the user is authenticated but has no sales
- WHEN the user navigates to `/sales`
- THEN the system renders an empty state message indicating no sales found

### Requirement: Date Range Filter

The system MUST filter sales by creation date via `from` and `to` ISO date query parameters.

#### Scenario: Filter by date range

- GIVEN the user is on the sales listing page
- WHEN the user selects a `from` (2026-01-01) and `to` (2026-03-31) date range and applies the filter
- THEN the system calls `GET /sales?from=2026-01-01&to=2026-03-31`
- AND renders only sales within that range

#### Scenario: Filter by start date only

- GIVEN the user is on the sales listing page
- WHEN the user selects only a `from` date
- THEN the system calls `GET /sales?from=2026-01-01` and returns sales from that date onward

### Requirement: Product Filter

The system SHOULD allow filtering sales by a specific product via `productId` query parameter.

#### Scenario: Filter by product

- GIVEN the user is on the sales listing page
- WHEN the user selects a product filter and applies it
- THEN the system calls `GET /sales?productId={id}`
- AND renders only sales that contain that product

### Requirement: Pagination Controls

The system MUST display pagination controls showing current page, total pages, and total items, and MUST support navigating between pages.

#### Scenario: Navigate to next page

- GIVEN the user is on page 1 of sales results and `totalPages > 1`
- WHEN the user clicks the next page button
- THEN the system calls `GET /sales?page=2&pageSize=10`
- AND renders the next page of results with updated pagination info

#### Scenario: Page calculation edge case

- GIVEN there are 0 sales for the authenticated user
- WHEN the system receives `totalItems: 0, totalPages: 1`
- THEN the DataTable shows the empty state and pagination shows page 1 of 1
