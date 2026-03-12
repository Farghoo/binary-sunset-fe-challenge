# Binary Sunset FE Challenge — AG Grid Table

This project demonstrates a high-performance AG Grid table with:
- **20,000+ rows** (generated data)
- **Mixed data types** (string, number, boolean)
- **Custom cell renderers**
  - “Chips” renderer for categories and status indicators
  - Calculation renderer for derived numeric values
- **Dynamic row-level calculations** (recomputed instantly on edits)
- **Real-time, input-driven updates** (editing Revenue/Cost updates Profit/Margin/Status)
- **Testing**
  - Unit tests (calculation logic, renderers, update mechanism)
  - Cypress E2E tests (edit + large dataset interaction)

## Setup

### Prerequisites
- Node.js 18+ (recommended)
- npm

### Install dependencies
```bash
npm install
```

### Run the app (development)
```bash
npm run dev
```

### Run unit tests (Jest)
```bash
npm test
```

### Run E2E tests (Cypress)
#### 1) Start the dev server (E2E mode)
This enables a test-only configuration to reduce flakiness (disables column virtualization so off-screen columns are still queryable).

```bash
npm run dev:e2e
```
#### 2) Run Cypress
In a separate terminal:
```bash
npm run cypress:run
```
Or interactively:
```bash
npm run cypress:open
```

### How the grid works
#### Data
Rows represent Products with a Category, Active flag, and numeric fields:
- Revenue (editable)
- Cost (editable)
Calculated columns
- Profit = Revenue − Cost
- Margin = Profit / Revenue
- Status (chips)

Status is derived from row values:
- **Inactive** if isActive = false
- **Critical** if Profit < 0
- **Warning** for low profit or low margin
- **High** for high profit and high margin
- **Ok** otherwise

Editing Revenue/Cost triggers recalculation and refresh of dependent cells and chips.

### Assumptions & trade-offs
**Performance**: Uses AG Grid’s row virtualization by default and avoids heavy per-cell work. Renderers are lightweight and memoized.
**Calculated values**: Implemented via valueGetter for real-time updates without maintaining duplicated state.

### Testing strategy:
JSDOM is not ideal for fully validating AG Grid virtualization and cell editing, so Cypress E2E is the source of truth for interaction + large dataset behavior.
Unit tests cover calculation logic and renderer behavior.

**E2E stability**: In E2E mode we disable column virtualization to keep selectors stable (this does not change production behavior).

### Scripts
`npm run dev` – start dev server

`npm run dev:e2e` – start dev server with E2E settings enabled

`npm test` – run Jest tests

`npm run cypress:open` – open Cypress UI (E2E mode flag is applied)

`npm run cypress:run` – run Cypress headless (E2E mode flag is applied)
