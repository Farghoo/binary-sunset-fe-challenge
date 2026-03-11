/**
 * @fileoverview Domain-specific financial calculation utilities for the Orders feature.
 *
 * All functions are pure (no side effects, no React imports) — trivially testable.
 *
 * Status thresholds (adjust here to change globally):
 *   >= 55%  → excellent
 *   >= 35%  → good
 *   >=  0%  → warning
 *    < 0%   → loss
 *
 * Generic display formatters (formatUsd, formatPercent) live in
 * `src/shared/utils/formatters.ts`.
 */

import type { OrderAnalyticsRow, OrderStatus } from '../types/orders.types';

/** Margin thresholds that determine chip status. */
const MARGIN_THRESHOLDS = {
  excellent: 55,
  good: 35,
  warning: 0,
} as const;

/**
 * Derives an `OrderStatus` from a margin percentage.
 *
 * @param marginPct - Profit margin as a percentage (can be negative)
 */
export function getStatusFromMargin(marginPct: number): OrderStatus {
  if (marginPct >= MARGIN_THRESHOLDS.excellent) return 'excellent';
  if (marginPct >= MARGIN_THRESHOLDS.good) return 'good';
  if (marginPct >= MARGIN_THRESHOLDS.warning) return 'warning';
  return 'loss';
}

/**
 * Recalculates derived financial fields when an editable cell changes.
 *
 * Calculation chain:
 *   `price_usd` / `items_purchased` → `revenue` → `profit` → `margin_pct` → `status`
 *
 * @param row     - The current row data (source of non-editable fields)
 * @param updates - Partial override of editable fields
 */
export function recalculateRow(
  row: OrderAnalyticsRow,
  updates: Partial<Pick<OrderAnalyticsRow, 'price_usd' | 'items_purchased'>>
): Pick<OrderAnalyticsRow, 'revenue' | 'profit' | 'margin_pct' | 'status'> {
  const priceUsd = updates.price_usd ?? row.price_usd;
  const itemsCount = updates.items_purchased ?? row.items_purchased;

  const revenue = round2(priceUsd * itemsCount);
  const profit = round2(revenue - row.cogs_usd - row.refund_amount);
  const marginPct = revenue > 0 ? round2((profit / revenue) * 100) : 0;

  return { revenue, profit, margin_pct: marginPct, status: getStatusFromMargin(marginPct) };
}

/** Rounds to 2 decimal places to avoid floating-point drift. */
function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}
