/**
 * @fileoverview Order status enum values.
 *
 * Single source of truth for valid status strings.
 * Consumed by Zod schema (for runtime validation) and
 * TypeScript types (for compile-time safety).
 */

export const ORDER_STATUS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  WARNING: 'warning',
  LOSS: 'loss',
} as const;
