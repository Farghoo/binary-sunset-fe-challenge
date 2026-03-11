/**
 * @fileoverview Order data mapper.
 *
 * Transforms raw API response DTOs into validated UI models using Zod.
 * This is the single point where API shape changes are absorbed —
 * swap this file if the data source changes; UI components stay untouched.
 *
 * Uses `.safeParse()` intentionally: invalid rows are skipped and the
 * caller receives a `skippedCount` to surface a user-visible notification.
 */

import { OrderAnalyticsRowSchema } from '../schemas/orderRow.schema';
import type { OrderAnalyticsRow } from '../types/orders.types';

/**
 * Validates and maps a raw API record to an `OrderAnalyticsRow`.
 * Returns `null` if the record fails Zod schema validation.
 *
 * @param raw - Unknown data from the API response
 * @returns Validated `OrderAnalyticsRow` or `null`
 */
export function mapApiRecordToRow(raw: unknown): OrderAnalyticsRow | null {
  const result = OrderAnalyticsRowSchema.safeParse(raw);
  if (!result.success) return null;
  return result.data;
}

/** Result of mapping an array of raw records. */
export interface MapApiRecordsResult {
  rows: OrderAnalyticsRow[];
  /** Number of records that failed Zod validation and were filtered out. */
  skippedCount: number;
}

/**
 * Maps an array of raw API records to validated `OrderAnalyticsRow[]`.
 * Invalid records are filtered out; the caller receives `skippedCount`
 * to decide whether to surface a user-visible notification.
 *
 * @param rawItems - Array of unknown items from the API response
 * @returns `{ rows, skippedCount }`
 */
export function mapApiRecordsToRows(rawItems: unknown[]): MapApiRecordsResult {
  const rows: OrderAnalyticsRow[] = [];
  let skippedCount = 0;

  for (const raw of rawItems) {
    const row = mapApiRecordToRow(raw);
    if (row) rows.push(row);
    else skippedCount++;
  }

  return { rows, skippedCount };
}
