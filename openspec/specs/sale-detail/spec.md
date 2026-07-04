# Sale Detail Specification

## Purpose

Provide a read-only view of a single sale displaying all items, quantities, unit prices, subtotals, and the total amount.

## Requirements

### Requirement: Read-Only Sale View

The system MUST display a sale's metadata and line items in a read-only format. The user MUST NOT be able to edit or delete the sale.

#### Scenario: Happy path — load sale detail

- GIVEN the user is authenticated and the sale with id `sale-123` exists
- WHEN the user navigates to `/sales/sale-123`
- THEN the system fetches the sale detail
- AND displays the sale ID, creation date, and total
- AND lists each item with product name, quantity, unit price, and subtotal
- AND shows the grand total
- AND no edit or delete controls are present

#### Scenario: Loading state

- GIVEN the user navigates to a sale detail page
- WHEN the data is still being fetched
- THEN the system displays a loading indicator

#### Scenario: Sale not found

- GIVEN the user navigates to `/sales/nonexistent-id`
- WHEN the sale does not exist
- THEN the system displays a "Sale not found" error state
- AND provides a link to return to the sales listing page

### Requirement: Item-Level Display

The system MUST display each line item with `productName`, `quantity`, `unitPrice`, and `subtotal`. The subtotal MUST be computed as `quantity × unitPrice`.

#### Scenario: Sale with multiple items

- GIVEN the sale has 3 items with different quantities and prices
- WHEN the detail page renders
- THEN each item row shows the product name, quantity, unit price, and computed subtotal
- AND the total equals the sum of all subtotals

#### Scenario: Sale with single item

- GIVEN the sale has exactly 1 item
- WHEN the detail page renders
- THEN the single item is displayed with its details
- AND the total equals the subtotal of that item
