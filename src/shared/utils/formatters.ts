/**
 * @fileoverview Generic display formatters — no domain dependencies.
 *
 * These functions are pure, locale-aware, and reusable across any feature.
 * Domain-specific calculations (recalculateRow, getStatusFromMargin) live in
 * `src/features/orders/utils/calculations.ts`.
 */

/**
 * Formats a number as USD currency with exactly 2 decimal places.
 *
 * @example formatUsd(1234.5) → '$1,234.50'
 */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage with one decimal place.
 *
 * @example formatPercent(61.01) → '61.0%'
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
