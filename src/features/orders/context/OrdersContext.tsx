/**
 * @fileoverview Feature-level Context for the Orders Analytics grid.
 *
 * Loading strategy:
 *  - `isPageLoading` starts true. Flips false only when the CURRENT epoch's
 *    first page arrives. Stale (cancelled) requests cannot flip it.
 *  - `epochRef` increments on every purge so cancelled getRows calls are
 *    identified and their loading-state side-effects are suppressed.
 *  - Before purging, `api.setRowCount(0)` resets the virtual row count so AG
 *    Grid does not create thousands of blank placeholder rows from the previous
 *    result set.
 *
 * The context shape (interface) lives in `interfaces/IOrdersContext.ts`.
 */

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { GridApi, IDatasource, IGetRowsParams } from 'ag-grid-community';

import { notificationService } from '@/shared/notifications/notificationService';

import type { IOrdersContext } from '../interfaces/IOrdersContext';
import { ordersService } from '../services/ordersService';
import type { EditableOrderFields, OrderAnalyticsRow } from '../types/orders.types';
import { recalculateRow } from '../utils/calculations';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const OrdersContext = createContext<IOrdersContext | null>(null);
OrdersContext.displayName = 'OrdersContext';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface OrdersProviderProps {
  children: React.ReactNode;
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQueryState] = useState('');
  const [editedCount, setEditedCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const gridApiRef = useRef<GridApi<OrderAnalyticsRow> | null>(null);
  const searchQueryRef = useRef('');

  /**
   * Epoch increments on every explicit purge (search / reset).
   * The datasource captures the epoch at the start of each getRows call.
   * Only the call whose captured epoch still matches the current epoch is
   * allowed to flip isPageLoading — stale/cancelled calls are silently ignored.
   */
  const epochRef = useRef(0);

  /** Purge the cache and reset virtual row count so no blank rows appear. */
  const purgeAndReset = useCallback(() => {
    if (!gridApiRef.current) return;
    epochRef.current += 1;
    setIsPageLoading(true);
    // Reset virtual row count to 0 so AG Grid does not keep old placeholder rows
    gridApiRef.current.setRowCount(0, false);
    gridApiRef.current.purgeInfiniteCache();
  }, []);

  const setSearchQuery = useCallback(
    (query: string) => {
      searchQueryRef.current = query;
      setSearchQueryState(query);
      if (gridApiRef.current) {
        // Grid mounted: purge cache and show loading overlay
        purgeAndReset();
      } else {
        // Grid unmounted (e.g. empty state shown): increment epoch and set
        // loading so the grid remounts and fires the datasource on mount
        epochRef.current += 1;
        setIsPageLoading(true);
      }
    },
    [purgeAndReset]
  );

  /**
   * Stable AG Grid IDatasource. Created once — reads from refs so it never
   * needs to be recreated. The captured `epoch` guards against stale calls.
   */
  const datasource = useMemo<IDatasource>(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        const { startRow, endRow, sortModel, successCallback, failCallback } = params;
        const sortBy = sortModel[0]?.colId ?? '';
        const sortDir = (sortModel[0]?.sort ?? 'asc') as 'asc' | 'desc';
        // Capture epoch BEFORE the async call
        const capturedEpoch = epochRef.current;

        try {
          const { rows, total } = await ordersService.getAll({
            limit: endRow - startRow,
            offset: startRow,
            search: searchQueryRef.current,
            sortBy,
            sortDir,
          });
          setTotalRows(total);
          setError(null);
          // Pass the real lastRow only on the final page so AG Grid grows the
          // virtual scroll incrementally instead of pre-creating all rows.
          const isLastPage = startRow + rows.length >= total;
          successCallback(rows, isLastPage ? startRow + rows.length : -1);
          // Only the latest epoch's first page may close the loading overlay
          if (startRow === 0 && capturedEpoch === epochRef.current) {
            setIsPageLoading(false);
          }
        } catch (err) {
          const e = err instanceof Error ? err : new Error('Failed to load orders');
          setError(e);
          if (startRow === 0 && capturedEpoch === epochRef.current) {
            setIsPageLoading(false);
          }
          notificationService.notify('toastComponentError', 'error');
          failCallback();
        }
      },
    }),
    [] // stable — all mutable state accessed via refs
  );

  const updateRow = useCallback((rowId: number, updates: Partial<EditableOrderFields>) => {
    const node = gridApiRef.current?.getRowNode(String(rowId));
    if (!node?.data) return;
    const existing = node.data as OrderAnalyticsRow;
    const recalculated = recalculateRow(existing, updates);
    const updated: OrderAnalyticsRow = { ...existing, ...updates, ...recalculated };
    node.setData(updated);
    setEditedCount((c) => c + 1);
  }, []);

  const resetFilters = useCallback(() => {
    searchQueryRef.current = '';
    setSearchQueryState('');
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel(null);
      purgeAndReset();
    }
    setEditedCount(0);
  }, [purgeAndReset]);

  const value = useMemo<IOrdersContext>(
    () => ({
      datasource,
      totalRows,
      searchQuery,
      setSearchQuery,
      isPageLoading,
      error,
      editedCount,
      updateRow,
      resetFilters,
      gridApiRef,
    }),
    [
      datasource,
      totalRows,
      searchQuery,
      setSearchQuery,
      isPageLoading,
      error,
      editedCount,
      updateRow,
      resetFilters,
    ]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useOrders(): IOrdersContext {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an <OrdersProvider>');
  }
  return ctx;
}
