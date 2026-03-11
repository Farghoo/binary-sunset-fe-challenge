/**
 * @fileoverview AG Grid wiring hook for the Orders feature.
 *
 * Encapsulates:
 *  - `getRowId`              — stable row identity for O(1) applyTransaction
 *  - `onGridReady`           — stores the Grid API in the shared context ref
 *  - `onCellEditingStopped`  — commits edits, delegates recalculation to context
 *
 * `OrdersGrid` spreads the returned object directly onto `<AgGridReact>`,
 * keeping the component purely presentational.
 *
 * Interface: `IOrdersGridCallbacks` (interfaces/IOrdersGridCallbacks.ts)
 */

import { useCallback } from 'react';
import type { CellEditingStoppedEvent, GetRowIdParams, GridReadyEvent } from 'ag-grid-community';

import { useOrders } from '../context/OrdersContext';
import type { IOrdersGridCallbacks } from '../interfaces/IOrdersGridCallbacks';
import type { OrderAnalyticsRow } from '../types/orders.types';

/**
 * Returns AG Grid event handlers wired to the Orders context.
 * Must be used inside `<OrdersProvider>`.
 */
export function useOrdersGrid(): IOrdersGridCallbacks {
  const { updateRow, gridApiRef } = useOrders();

  /** Stable row identity — AG Grid uses this for applyTransaction matching. */
  const getRowId = useCallback(
    (params: GetRowIdParams<OrderAnalyticsRow>) => String(params.data.order_item_id),
    []
  );

  /** Store the Grid API in the shared ref when the grid mounts, then show loading. */
  const onGridReady = useCallback(
    (event: GridReadyEvent<OrderAnalyticsRow>) => {
      gridApiRef.current = event.api;
    },
    [gridApiRef]
  );

  /**
   * Called after the user commits an inline edit.
   * Only `price_usd` and `items_purchased` trigger recalculation.
   * Guards against cancelled edits (newValue === oldValue).
   */
  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent<OrderAnalyticsRow>) => {
      const { data, colDef, newValue, oldValue } = event;
      if (!data || newValue === oldValue || newValue === undefined) return;

      const field = colDef.field as keyof OrderAnalyticsRow;
      if (field !== 'price_usd' && field !== 'items_purchased') return;

      updateRow(data.order_item_id, { [field]: Number(newValue) });
    },
    [updateRow]
  );

  return { getRowId, onGridReady, onCellEditingStopped };
}
