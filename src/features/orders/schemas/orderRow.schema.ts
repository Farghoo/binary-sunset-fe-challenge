/**
 * @fileoverview Zod schema for a single OrderAnalyticsRow.
 *
 * This schema is the runtime validation gate at the API boundary.
 * TypeScript types are derived FROM this schema via `z.infer<>` —
 * see `types/orders.types.ts`. Never duplicate type definitions manually.
 *
 * Enum values are imported from the enums layer so both Zod and TS
 * share the exact same string literals.
 */

import { z } from 'zod';

import { DEVICE_TYPE } from '../enums/deviceType.enum';
import { ORDER_STATUS } from '../enums/orderStatus.enum';

export const OrderStatusSchema = z.enum([
  ORDER_STATUS.EXCELLENT,
  ORDER_STATUS.GOOD,
  ORDER_STATUS.WARNING,
  ORDER_STATUS.LOSS,
]);

export const DeviceTypeSchema = z.enum([DEVICE_TYPE.MOBILE, DEVICE_TYPE.DESKTOP]);

export const OrderAnalyticsRowSchema = z.object({
  _id: z.string().optional(),

  order_item_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  created_at: z.string().datetime({ offset: true }).or(z.string().min(1)),
  user_id: z.number().int().positive(),

  product_id: z.number().int().positive(),
  product_name: z.string().min(1),
  is_primary_item: z.boolean(),

  website_session_id: z.number().int().positive(),
  device_type: DeviceTypeSchema,
  utm_source: z.string().default('direct'),
  utm_campaign: z.string().default('direct'),
  is_repeat_session: z.boolean(),

  price_usd: z.number().nonnegative(),
  cogs_usd: z.number().nonnegative(),
  items_purchased: z.number().int().positive(),
  refund_amount: z.number().nonnegative(),

  revenue: z.number(),
  profit: z.number(),
  margin_pct: z.number(),
  status: OrderStatusSchema,

  is_refunded: z.boolean(),
});
