# Binary Sunset — Orders Analytics

> A high-performance AG Grid data table built for OTTO's Binary Sunset frontend challenge.
> Handles 15 000+ real e-commerce rows with live inline editing, dynamic recalculation,
> chip-based status rendering, i18n, and a layered testing strategy.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture & Design Philosophy](#architecture--design-philosophy)
4. [Requirements Coverage](#requirements-coverage)
5. [Technology Stack](#technology-stack)
6. [Scripts Reference](#scripts-reference)
7. [Environment Variables](#environment-variables)
8. [SOLID Principles in Practice](#solid-principles-in-practice)
9. [Performance Strategy](#performance-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Data Flow](#data-flow)
12. [i18n](#i18n)
13. [MSW Mock API](#msw-mock-api)

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| npm | >= 10 |

### Steps

```bash
# 1. Fork https://github.com/Farghoo/binary-sunset-fe-challenge on GitHub,
#    then clone your fork
git clone https://github.com/sgurbuz/binary-sunset-fe-challenge.git
cd binary-sunset-fe-challenge

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the dev server (MSW mock active by default)
npm run dev
```

The app is now available at `http://localhost:5173`.

> **No backend required for development.** MSW intercepts all API calls and
> serves data from `mock-data/orders.json` (15 000 rows).

### Optional: Connect to the real backend

```bash
# Create a .env.local file
echo "VITE_API_BASE_URL=http://localhost:3001" > .env.local
npm run dev
```

---

## Project Structure

```
src/
├── config/                   # Environment-driven API config
├── constants/                # Route constants, React Query keys
├── features/
│   └── orders/
│       ├── columnDefs/       # AG Grid column definitions + cell renderers
│       │   └── renderers/    # SourceChip, StatusChip, Profit, Margin, Device
│       ├── components/       # OrdersGrid, OrdersGridToolbar
│       ├── context/          # OrdersContext (infinite datasource, state)
│       ├── enums/            # OrderStatus, DeviceType
│       ├── hooks/            # useOrdersGrid (AG Grid event wiring)
│       ├── interfaces/       # IOrdersContext, IOrdersService, IOrdersGridCallbacks
│       ├── mappers/          # Raw API → typed domain objects (Zod validation)
│       ├── schemas/          # Zod schemas (single source of truth for types)
│       ├── services/         # ordersService (axios, implements IOrdersService)
│       ├── types/            # TypeScript types inferred from Zod schemas
│       └── utils/            # calculations.ts (pure), statusHelpers.ts (pure)
├── i18n/                     # Lazy-loaded translations (en / de)
├── layouts/                  # MainLayout (header, language switcher)
├── mocks/                    # MSW browser worker + handlers
├── pages/                    # OrdersPage, NotFoundPage
├── providers/                # AppProviders (Query, I18n, Notifications, Router)
├── router/                   # React Router v6 config
└── shared/
    ├── components/           # EmptyState, ErrorBoundary, StatusChip, LanguageSwitcher
    ├── hooks/                # useDebounce, useLocalStorage
    ├── interfaces/           # IChipDisplayConfig
    ├── notifications/        # notificationService (event bus)
    └── utils/                # formatters.ts (formatUsd, formatPercent)
```

---

## Architecture & Design Philosophy

### Feature-Sliced Architecture

Each feature (`orders`) is self-contained: types, services, context, components, and
column definitions all live under `features/orders/`. Cross-feature code lives in
`shared/`. This prevents coupling and makes each slice independently testable.

### Context API as Feature State

`OrdersContext` owns all mutable state for the orders feature:

- `datasource` — stable AG Grid `IDatasource` (created once with `useMemo([])`)
- `isPageLoading` — React-controlled loading overlay (not AG Grid's unreliable overlay API)
- `epochRef` — monotonically increasing integer; guards against stale async callbacks
- `searchQueryRef` — mutable ref read synchronously inside the datasource closure
- `gridApiRef` — shared access to the AG Grid API from toolbar and context

### Zod as the Single Source of Truth

Types are never written manually. Instead:

1. `schemas/orderRow.schema.ts` defines the Zod schema
2. `types/orders.types.ts` re-exports `z.infer<typeof Schema>` as TypeScript types
3. `mappers/orderMapper.ts` validates every API response at the boundary

Any change to the data contract is made once (the schema) and propagates automatically.

### Pure Utility Functions

`calculations.ts` and `statusHelpers.ts` contain zero React imports, zero side effects.
They are plain TypeScript functions that take values and return values — trivially testable
with `jest` without any rendering.

---

## Requirements Coverage

### AG Grid — Large Dataset

| Requirement | Implementation |
|---|---|
| 15 000+ rows | Seeded from `order_items.csv` (40 k source rows, 15 k seeded to MongoDB) |
| Infinite row model | `rowModelType="infinite"`, `cacheBlockSize=20` |
| Smooth scrolling | AG Grid virtualization; `animateRows: false` at 10k+ rows |
| Sort | `sortModel` forwarded to API as `sortBy` / `sortDir` query params |
| Search / filter | Debounced search triggers `purgeInfiniteCache()` + fresh datasource load |
| Data variety | string, number, boolean, date, enum columns (17 columns total) |

### Custom Cell Renderers — Chips

| Renderer | Column | Logic |
|---|---|---|
| `StatusChipCellRenderer` | Status | Maps `OrderStatus` enum → color + icon via `STATUS_CHIP_CONFIG` |
| `SourceChipCellRenderer` | UTM Source | Maps source string → brand color chip |
| `DeviceChipCellRenderer` | Device Type | Mobile / Desktop / Tablet with icons |
| `ProfitCellRenderer` | Profit | Directional arrow + color (positive/low/negative) |
| `MarginCellRenderer` | Margin % | Progress-bar style with threshold colors |

All renderers guard against loading rows: `if (!params.data) return null`.

### Dynamic Calculations

Calculation chain triggered by editing `price_usd` or `items_purchased`:

```
price_usd × items_purchased → revenue
revenue − cogs_usd − refund_amount → profit
(profit / revenue) × 100 → margin_pct
margin_pct threshold → status (excellent / good / warning / loss)
```

**One calculated column drives the chips renderer:** `margin_pct` → `status` → `StatusChipCellRenderer`.
The chip updates instantly — no page reload, no API call.

### Editable Cells

| Column | Editor | Constraint |
|---|---|---|
| `price_usd` | `agNumberCellEditor` | min: 0, max: 9999, precision: 2 |
| `items_purchased` | `agNumberCellEditor` | min: 1, max: 10, precision: 0 |

Edit flow: `onCellEditingStopped` → `updateRow()` → `recalculateRow()` → `node.setData()` → AG Grid re-renders the row in O(1).

### Performance

| Technique | Detail |
|---|---|
| Infinite row model | Only 20 rows in memory per block; AG Grid purges off-screen blocks |
| Incremental scrollbar | `successCallback(rows, -1)` until final page; prevents 15k placeholder rows |
| `getRowId` | `order_item_id` string; enables O(1) `node.setData()` instead of full re-render |
| `React.memo` | All cell renderers and grid components wrapped |
| `useMemo([])` | Datasource created once; no re-creation on context re-renders |
| `epochRef` | Prevents stale `setIsPageLoading(false)` calls from cancelled requests |
| `searchQueryRef` | Avoids stale closure in datasource; updated synchronously before purge |
| `animateRows: false` | Eliminates row animation overhead at scale |
| Debounced search | 300 ms debounce prevents API flood on keystroke |

---

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript 5 | Required by challenge |
| Grid | AG Grid Community 32 | Virtualised, infinite model, built-in editors |
| State | React Context API | Required by challenge; sufficient for single-feature scope |
| Data fetching | TanStack Query v5 | Server-state cache, background refetch |
| HTTP | Axios | Interceptors, timeout, typed responses |
| Validation | Zod | Runtime safety at API boundary; types for free |
| UI | MUI v5 (Material UI) | Required by challenge; CircularProgress, Chip, Button |
| Styling | SCSS Modules + CSS Custom Properties | Scoped styles, theme tokens, no runtime CSS-in-JS |
| i18n | Custom Context + lazy loaders | Lightweight; no heavy i18n library dependency |
| Mock API | MSW v2 | Intercepts at Service Worker level; production-identical code path |
| Testing | Jest + React Testing Library | Unit + component tests |
| E2E | Cypress | Critical user flow coverage |
| Docs | TypeDoc | Auto-generated from JSDoc comments |
| Build | Vite 5 | Fast HMR; ESM native |
| Linting | ESLint + Prettier + lint-staged | Enforced on every commit via Husky |
| Commits | Commitlint (conventional commits) | Consistent history |

---

## Scripts Reference

```bash
# Development
npm run dev               # Start Vite dev server with MSW mock

# Build & Preview
npm run build             # TypeScript check + Vite production build
npm run preview           # Serve production build locally

# Code Quality
npm run typecheck         # tsc --noEmit (no emit, just type check)
npm run lint              # ESLint with zero warnings tolerance
npm run lint:fix          # ESLint with auto-fix
npm run format            # Prettier write
npm run format:check      # Prettier check (used in CI)
npm run validate          # typecheck + format:check + lint (full pre-push check)
npm run fix               # format + lint:fix (quick local cleanup)

# Testing
npm run test              # Jest unit tests (--passWithNoTests)
npm run test:watch        # Jest in watch mode
npm run test:coverage     # Jest with coverage report
npm run test:e2e          # Open Cypress interactive runner
npm run test:e2e:headless # Run Cypress in CI headless mode
npm run test:all          # Jest + Cypress headless

# Documentation
npm run docs:build        # Generate TypeDoc HTML docs → ./docs/
npm run docs:serve        # Serve docs at http://localhost:4000
npm run docs              # Build + serve in one command
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | Backend API base URL |
| `VITE_ENABLE_MSW` | `true` | Enable MSW mock in development |

Create `.env.local` to override defaults (git-ignored).

---

## SOLID Principles in Practice

### Single Responsibility

Each file has one job:
- `calculations.ts` — only financial math
- `statusHelpers.ts` — only status/chip config mapping
- `ordersService.ts` — only HTTP communication
- `orderMapper.ts` — only data transformation and validation
- `useOrdersGrid.ts` — only AG Grid event wiring

### Open/Closed

- Adding a new column: append one entry to `getOrderColumnDefs()`. Zero other files change.
- Adding a new status: add one entry to `STATUS_CHIP_CONFIG`. Zero other files change.
- Adding a new renderer: create a file in `renderers/`, export from `renderers/index.ts`.

### Liskov Substitution

`ordersService` satisfies `IOrdersService`. In tests, a mock object with the same interface
is injected. The Context is unaware of the concrete implementation.

### Interface Segregation

Interfaces are focused and small:
- `IOrdersContext` — only context-consumer contract
- `IOrdersService` — only `getAll()` and `getStats()`
- `IOrdersGridCallbacks` — only `getRowId`, `onGridReady`, `onCellEditingStopped`
- `IChipDisplayConfig` — only chip display fields

### Dependency Inversion

`OrdersContext` depends on `IOrdersService`, not `ordersService` directly.
`OrdersGrid` depends on `IOrdersContext` via the `useOrders()` hook.
The concrete implementation is only wired at the top of the tree.

---

## Performance Strategy

### Infinite Row Model vs Client-Side

With 15 000 rows, loading everything client-side would require:
- One large HTTP request (~4 MB JSON)
- AG Grid processing all rows at mount
- Significant memory usage for nodes

**Infinite row model** loads 20 rows per scroll block. AG Grid virtualises the DOM
(only ~30 rows rendered at any time regardless of dataset size).

### The Epoch Pattern (Stale Callback Prevention)

```
purgeInfiniteCache() → old getRows() callbacks still in flight
                      → they resolve and try to call setIsPageLoading(false)
                      → loading spinner disappears too early ❌

epochRef.current++   → old callbacks compare captured epoch vs current
                      → mismatch → they silently discard their side effects ✓
```

### Incremental Scrollbar

```
successCallback(rows, total)  → AG Grid creates 15000 virtual rows immediately
                                → scrollbar is tiny from the start ❌

successCallback(rows, -1)     → AG Grid adds only the current block
                                → scrollbar grows as user scrolls ✓
                                → on final page: pass actual lastRow
```

### node.setData() vs applyTransaction

In infinite row model, `applyTransaction` is not supported. `node.setData(updated)`
is the correct API — it updates the specific row node in O(1) without touching the cache.

---

## Testing Strategy

### Unit Tests (`src/__tests__/`)

| File | What it tests |
|---|---|
| `utils/calculations.test.ts` | `recalculateRow`, `getStatusFromMargin` — all threshold boundaries |
| `utils/statusHelpers.test.ts` | `STATUS_CHIP_CONFIG` completeness, `getSourceChipConfig` fallback |

All utility tests are synchronous pure-function tests — no mocking required.

### Component Tests (planned)

- `StatusChipCellRenderer` — renders correct variant per status
- `ProfitCellRenderer` — arrow direction and color class per profit value
- `OrdersGridToolbar` — search debounce, reset button visibility

### Integration / E2E Tests (Cypress, planned)

Critical flows:
1. Load grid → see 20 rows → scroll → see next 20 rows load
2. Type in search → loading overlay appears → results update → count chip updates
3. Edit `price_usd` → `revenue`, `profit`, `margin_pct` columns update instantly
4. Edit price to trigger loss threshold → Status chip changes to "Loss"
5. Reset filters → grid returns to initial state

---

## Data Flow

```
User scrolls / searches
        │
        ▼
AG Grid calls datasource.getRows(params)
        │
        ▼
ordersService.getAll({ offset, limit, search, sortBy, sortDir })
        │
        ▼  (MSW intercepts in dev / real Express in prod)
GET /api/orders?offset=0&limit=20&...
        │
        ▼
mapApiRecordsToRows() — Zod validation, skip invalid records
        │
        ▼
successCallback(rows, lastRow)
        │
        ▼
AG Grid renders new block, virtualises off-screen rows

--- Inline Edit ---

User edits price_usd cell
        │
        ▼
onCellEditingStopped → updateRow(rowId, { price_usd: newValue })
        │
        ▼
recalculateRow(existing, updates) → { revenue, profit, margin_pct, status }
        │
        ▼
node.setData(merged) — AG Grid re-renders only this row
        │
        ▼
ProfitCellRenderer, MarginCellRenderer, StatusChipCellRenderer
all re-render with new data
```

---

## i18n

Translations are lazily loaded by namespace:

```typescript
const { t } = useTranslation('ordersGrid');
const columnDefs = useMemo(() => getOrderColumnDefs(t), [t]);
```

When the language changes (EN ↔ DE), `t` reference changes → `useMemo` recomputes →
AG Grid receives new `columnDefs` → column headers re-render with new language.

Supported locales: **English** (`en`), **German** (`de`)

Namespaces: `common`, `ordersGrid`, `ordersToolbar`, `notFound`

---

## MSW Mock API

Development runs against MSW (Mock Service Worker) by default. The mock:

- Loads `mock-data/orders.json` lazily (cached after first load)
- Supports `offset`, `limit`, `search`, `sortBy`, `sortDir` query params
- Returns `{ data: Row[], total: number }` — identical shape to the real Express API
- Search is case-insensitive across `product_name`, `utm_source`, `utm_campaign`,
  `device_type`, `status`, `created_at`

To disable MSW and hit the real backend, set `VITE_ENABLE_MSW=false` in `.env.local`.
