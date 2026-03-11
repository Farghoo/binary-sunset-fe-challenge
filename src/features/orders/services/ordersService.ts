/**
 * @fileoverview Orders API service — implements `IOrdersService`.
 *
 * Handles all HTTP communication for the orders domain.
 * Data is validated via the mapper (Zod) at this boundary — callers
 * receive only type-safe `OrderAnalyticsRow` objects.
 *
 * To switch data sources (REST → GraphQL, real → mock):
 * create a new object satisfying `IOrdersService` and swap the export.
 * Context and components are completely unaffected.
 *
 * In Real world example we need to implement cancel property for HTTP Requests
 */

import axios from 'axios';

import { notificationService } from '@/shared/notifications/notificationService';
import { API_CONFIG } from '@/config/api.config';

import type { GetAllParams, GetAllResult, IOrdersService } from '../interfaces/IOrdersService';
import { mapApiRecordsToRows } from '../mappers/orderMapper';

/** Shared axios instance — configured once, reused by all order endpoints. */
const httpClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.defaults.timeout,
  headers: { 'Content-Type': 'application/json' },
});

export const ordersService: IOrdersService = {
  /**
   * Fetches a page of order analytics rows from the API.
   * Validates response shape via Zod — invalid records are filtered out.
   *
   * @param params - Pagination, search, and sort parameters
   * @returns Validated rows and total matching count
   */
  async getAll(params: GetAllParams = {}): Promise<GetAllResult> {
    const { limit = 20, offset = 0, search = '', sortBy = '', sortDir = 'asc' } = params;

    const query = new URLSearchParams();
    query.set('limit', String(limit));
    query.set('offset', String(offset));
    if (search) query.set('search', search);
    if (sortBy) query.set('sortBy', sortBy);
    if (sortDir) query.set('sortDir', sortDir);

    const { data } = await httpClient.get<{ data: unknown[]; total: number }>(
      `${API_CONFIG.endpoints.orders}?${query.toString()}`
    );

    const { rows, skippedCount } = mapApiRecordsToRows(data.data);
    if (skippedCount > 0) {
      notificationService.notify('toastDataSkipped', 'warning');
    }
    return { rows, total: data.total };
  },

  /**
   * Fetches aggregate statistics for the orders dataset.
   *
   * @returns Raw stats object (shape determined by backend)
   */
  async getStats(): Promise<Record<string, unknown>> {
    const { data } = await httpClient.get<Record<string, unknown>>(API_CONFIG.endpoints.orderStats);
    return data;
  },
};
