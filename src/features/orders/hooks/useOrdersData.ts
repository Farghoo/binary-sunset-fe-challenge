/**
 * @fileoverview TanStack Query hook for fetching orders data.
 *
 * NOTE: This hook is no longer used by OrdersContext — the context now uses
 * an AG Grid infinite datasource that calls ordersService.getAll directly.
 * Kept here for potential future use (e.g. stats widgets, exports).
 */

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';

import type { GetAllResult } from '../interfaces/IOrdersService';
import { ordersService } from '../services/ordersService';

/**
 * Fetches and caches the first page of orders analytics data.
 *
 * @returns TanStack Query result with `data: GetAllResult`
 */
export function useOrdersData() {
  return useQuery<GetAllResult, Error>({
    queryKey: QUERY_KEYS.orders.list(20),
    queryFn: () => ordersService.getAll({ limit: 20, offset: 0 }),
    staleTime: 5 * 60 * 1_000,
    gcTime: 10 * 60 * 1_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 10_000),
  });
}
