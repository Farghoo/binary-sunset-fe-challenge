/**
 * @fileoverview Service contract for the Orders domain.
 *
 * Components and hooks depend on this interface, not on the concrete
 * implementation — fulfilling the Dependency Inversion Principle.
 * Swapping REST → GraphQL or real API → mock only requires a new
 * class/object that satisfies this interface.
 */

import type { OrderAnalyticsRow } from '../types/orders.types';

export interface GetAllParams {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface GetAllResult {
  rows: OrderAnalyticsRow[];
  total: number;
}

export interface IOrdersService {
  /**
   * Fetches a page of order analytics rows.
   *
   * @param params - Pagination, search, and sort parameters
   * @returns Validated rows and total matching count
   */
  getAll(params?: GetAllParams): Promise<GetAllResult>;

  /**
   * Fetches aggregate statistics for the orders dataset.
   *
   * @returns Raw stats object (shape determined by backend)
   */
  getStats(): Promise<Record<string, unknown>>;
}
