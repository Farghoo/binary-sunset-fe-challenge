/**
 * @fileoverview AG Grid callback interface for the Orders grid.
 *
 * Props returned by `useOrdersGrid` and spread directly onto `<AgGridReact>`.
 * Keeping this interface separate makes the hook's return type explicit
 * and independently testable.
 */

import type { CellEditingStoppedEvent, GetRowIdParams, GridReadyEvent } from 'ag-grid-community';

import type { OrderAnalyticsRow } from '../types/orders.types';

export interface IOrdersGridCallbacks {
  /** Stable row identity function — required for O(1) node.setData() updates. */
  getRowId: (params: GetRowIdParams<OrderAnalyticsRow>) => string;

  /** Stores the Grid API ref when the grid mounts. */
  onGridReady: (event: GridReadyEvent<OrderAnalyticsRow>) => void;

  /** Fires after a cell edit is committed; triggers row recalculation. */
  onCellEditingStopped: (event: CellEditingStoppedEvent<OrderAnalyticsRow>) => void;
}
