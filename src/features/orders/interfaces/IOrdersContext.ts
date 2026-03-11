/**
 * @fileoverview Context value interface for the Orders feature.
 *
 * Separating the interface from the implementation (OrdersContext.tsx)
 * allows consumers to type-check against the contract without importing
 * React context internals.
 */

import type { MutableRefObject } from 'react';
import type { GridApi, IDatasource } from 'ag-grid-community';

import type { EditableOrderFields, OrderAnalyticsRow } from '../types/orders.types';

export interface IOrdersContext {
  /** AG Grid infinite datasource — passed directly to <AgGridReact datasource={...}>. */
  datasource: IDatasource;

  /** Total matching rows (updated after each datasource response). */
  totalRows: number;

  /** Current search query string. */
  searchQuery: string;

  /** Update search query — triggers a fresh datasource load. */
  setSearchQuery(query: string): void;

  /**
   * True while the first page is in flight (initial load, search, or reset).
   * Components use this to render a blocking loading overlay over the grid.
   */
  isPageLoading: boolean;

  /** Non-null when a datasource fetch has failed. */
  error: Error | null;

  /** Number of rows edited locally since last reset. */
  editedCount: number;

  /**
   * Apply an inline edit to a single row.
   * Recalculates `revenue`, `profit`, `margin_pct`, and `status` automatically.
   *
   * @param rowId   - `order_item_id` of the target row
   * @param updates - Partial override of editable fields
   */
  updateRow(rowId: number, updates: Partial<EditableOrderFields>): void;

  /** Clear all column filters, reset search, and purge the infinite cache. */
  resetFilters(): void;

  /**
   * Ref to the live AG Grid API.
   * Set by `OrdersGrid` on `onGridReady`; read by toolbar and context.
   */
  gridApiRef: MutableRefObject<GridApi<OrderAnalyticsRow> | null>;
}
