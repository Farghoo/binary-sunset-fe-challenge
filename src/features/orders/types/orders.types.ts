/**
 * @fileoverview TypeScript types for the Orders domain.
 *
 * All types are derived from Zod schemas via `z.infer<>` — never written manually.
 * This guarantees runtime validation and compile-time types stay in sync.
 *
 * Import types from here, not from the schema files directly.
 *
 * @example
 *   import type { OrderAnalyticsRow, OrderStatus } from '../types/orders.types';
 */

import type { z } from 'zod';

import type {
  DeviceTypeSchema,
  OrderAnalyticsRowSchema,
  OrderStatusSchema,
} from '../schemas/orderRow.schema';

/** A fully enriched order-item row served by the API and displayed in the grid. */
export type OrderAnalyticsRow = z.infer<typeof OrderAnalyticsRowSchema>;

/** Discriminated union of valid order statuses. */
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/** Device type for session data. */
export type DeviceType = z.infer<typeof DeviceTypeSchema>;

/** Fields that can be edited inline in the grid. */
export type EditableOrderFields = Pick<OrderAnalyticsRow, 'price_usd' | 'items_purchased'>;

/** Fields recalculated automatically after an edit. */
export type RecalculatedOrderFields = Pick<
  OrderAnalyticsRow,
  'revenue' | 'profit' | 'margin_pct' | 'status'
>;
