import { formatPercent, formatUsd } from '@/shared/utils/formatters';
import type { OrderAnalyticsRow } from '@/features/orders/types/orders.types';
import { getStatusFromMargin, recalculateRow } from '@/features/orders/utils/calculations';

const baseRow: OrderAnalyticsRow = {
  order_item_id: 1,
  order_id: 1,
  created_at: '2024-01-01',
  user_id: 1,
  product_id: 1,
  product_name: 'Test Product',
  is_primary_item: true,
  website_session_id: 1,
  device_type: 'desktop',
  utm_source: 'gsearch',
  utm_campaign: 'nonbrand',
  is_repeat_session: false,
  price_usd: 49.99,
  cogs_usd: 19.49,
  items_purchased: 1,
  refund_amount: 0,
  revenue: 49.99,
  profit: 30.5,
  margin_pct: 61.01,
  status: 'excellent',
  is_refunded: false,
};

// ---------------------------------------------------------------------------
// getStatusFromMargin
// ---------------------------------------------------------------------------

describe('getStatusFromMargin', () => {
  it('returns "excellent" for margin >= 55%', () => {
    expect(getStatusFromMargin(55)).toBe('excellent');
    expect(getStatusFromMargin(61)).toBe('excellent');
    expect(getStatusFromMargin(100)).toBe('excellent');
  });

  it('returns "good" for margin 35–54.99%', () => {
    expect(getStatusFromMargin(35)).toBe('good');
    expect(getStatusFromMargin(45)).toBe('good');
    expect(getStatusFromMargin(54.99)).toBe('good');
  });

  it('returns "warning" for margin 0–34.99%', () => {
    expect(getStatusFromMargin(0)).toBe('warning');
    expect(getStatusFromMargin(20)).toBe('warning');
    expect(getStatusFromMargin(34.99)).toBe('warning');
  });

  it('returns "loss" for negative margin', () => {
    expect(getStatusFromMargin(-0.01)).toBe('loss');
    expect(getStatusFromMargin(-50)).toBe('loss');
  });
});

// ---------------------------------------------------------------------------
// recalculateRow
// ---------------------------------------------------------------------------

describe('recalculateRow', () => {
  it('recalculates revenue when price_usd changes', () => {
    const result = recalculateRow(baseRow, { price_usd: 59.99 });
    expect(result.revenue).toBe(59.99);
  });

  it('recalculates profit correctly', () => {
    // profit = price * qty - cogs - refund = 49.99 * 1 - 19.49 - 0 = 30.50
    const result = recalculateRow(baseRow, { price_usd: 49.99 });
    expect(result.profit).toBe(30.5);
  });

  it('recalculates margin_pct correctly', () => {
    // margin = (30.5 / 49.99) * 100 ≈ 61.01%
    const result = recalculateRow(baseRow, { price_usd: 49.99 });
    expect(result.margin_pct).toBeCloseTo(61.01, 1);
  });

  it('recalculates revenue when items_purchased changes', () => {
    const result = recalculateRow(baseRow, { items_purchased: 2 });
    expect(result.revenue).toBeCloseTo(99.98, 2);
  });

  it('updates status to "loss" when price drops below cogs + refund', () => {
    const result = recalculateRow(baseRow, { price_usd: 10 });
    expect(result.profit).toBeLessThan(0);
    expect(result.status).toBe('loss');
  });

  it('updates status to "warning" when margin is low', () => {
    const result = recalculateRow(baseRow, { price_usd: 25 });
    expect(result.status).toBe('warning');
  });

  it('accounts for refund amount in profit calculation', () => {
    const rowWithRefund = { ...baseRow, refund_amount: 49.99 };
    // profit = 49.99 - 19.49 - 49.99 = -19.49
    const result = recalculateRow(rowWithRefund, {});
    expect(result.profit).toBeCloseTo(-19.49, 2);
    expect(result.status).toBe('loss');
  });

  it('returns margin_pct of 0 when price is 0 (prevents division by zero)', () => {
    const result = recalculateRow(baseRow, { price_usd: 0 });
    expect(result.margin_pct).toBe(0);
    expect(result.status).toBe('warning');
  });

  it('uses existing row values when no updates provided', () => {
    const result = recalculateRow(baseRow, {});
    expect(result.revenue).toBe(49.99);
    expect(result.profit).toBe(30.5);
  });
});

// ---------------------------------------------------------------------------
// formatUsd (shared formatter)
// ---------------------------------------------------------------------------

describe('formatUsd', () => {
  it('formats positive values with dollar sign and commas', () => {
    expect(formatUsd(49.99)).toBe('$49.99');
    expect(formatUsd(1000)).toBe('$1,000.00');
  });

  it('formats negative values correctly', () => {
    expect(formatUsd(-19.49)).toBe('-$19.49');
  });

  it('formats zero correctly', () => {
    expect(formatUsd(0)).toBe('$0.00');
  });
});

// ---------------------------------------------------------------------------
// formatPercent (shared formatter)
// ---------------------------------------------------------------------------

describe('formatPercent', () => {
  it('formats with exactly one decimal place', () => {
    expect(formatPercent(61.01)).toBe('61.0%');
    expect(formatPercent(0)).toBe('0.0%');
    expect(formatPercent(-19.5)).toBe('-19.5%');
    expect(formatPercent(100)).toBe('100.0%');
  });
});
