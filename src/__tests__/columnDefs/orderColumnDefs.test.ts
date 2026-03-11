import type { ValueFormatterParams } from 'ag-grid-community';

import type { OrdersGridTranslations } from '@/i18n/locales/en/ordersGrid';
import { DEFAULT_COL_DEF, getOrderColumnDefs } from '@/features/orders/columnDefs/orderColumnDefs';
import type { OrderAnalyticsRow } from '@/features/orders/types/orders.types';

const t = (key: keyof OrdersGridTranslations) => key as string;

type Formatter = (p: ValueFormatterParams<OrderAnalyticsRow>) => string;
type CellStyleFn = (p: unknown) => object | null;

const cols = getOrderColumnDefs(t);

function findCol(field: string) {
  const col = cols.find((c) => c.field === field);
  if (!col) throw new Error(`Column "${field}" not found`);
  return col;
}

const fmtParams = (value: unknown, data?: object) =>
  ({ value, data }) as ValueFormatterParams<OrderAnalyticsRow>;

describe('getOrderColumnDefs', () => {
  it('returns an array of column definitions', () => {
    expect(Array.isArray(cols)).toBe(true);
    expect(cols.length).toBeGreaterThan(0);
  });

  it('includes an order_id column pinned left', () => {
    const col = cols.find((c) => c.field === 'order_id');
    expect(col).toBeDefined();
    expect(col?.pinned).toBe('left');
  });

  it('includes a status column pinned right', () => {
    const col = cols.find((c) => c.field === 'status');
    expect(col).toBeDefined();
    expect(col?.pinned).toBe('right');
  });

  it('marks price_usd as editable', () => {
    const col = cols.find((c) => c.field === 'price_usd');
    expect(col?.editable).toBe(true);
  });

  it('marks items_purchased as editable', () => {
    const col = cols.find((c) => c.field === 'items_purchased');
    expect(col?.editable).toBe(true);
  });

  it('revenue column is not editable', () => {
    const col = cols.find((c) => c.field === 'revenue');
    expect(col?.editable).toBeFalsy();
  });

  it('profit column has a cell renderer', () => {
    const col = cols.find((c) => c.field === 'profit');
    expect(col?.cellRenderer).toBeDefined();
  });

  it('status column has a cell renderer', () => {
    const col = cols.find((c) => c.field === 'status');
    expect(col?.cellRenderer).toBeDefined();
  });

  it('all columns have a headerName', () => {
    cols.forEach((col) => {
      expect(col.headerName).toBeTruthy();
    });
  });

  it('uses translation keys from t() for headerName', () => {
    const col = cols.find((c) => c.field === 'order_id');
    expect(col?.headerName).toBe('colOrderId');
  });
});

describe('valueFormatter — price_usd (usdFormatter)', () => {
  it('formats a valid number as USD', () => {
    const fmt = findCol('price_usd').valueFormatter as Formatter;
    expect(fmt(fmtParams(49.99))).toBe('$49.99');
  });

  it('returns empty string for null value', () => {
    const fmt = findCol('price_usd').valueFormatter as Formatter;
    expect(fmt(fmtParams(null))).toBe('');
  });

  it('returns empty string for undefined value', () => {
    const fmt = findCol('price_usd').valueFormatter as Formatter;
    expect(fmt(fmtParams(undefined))).toBe('');
  });
});

describe('valueFormatter — created_at (dateFormatter)', () => {
  it('formats a valid ISO date string', () => {
    const fmt = findCol('created_at').valueFormatter as Formatter;
    const result = fmt(fmtParams('2024-01-15'));
    expect(result).toMatch(/Jan|15|2024/);
  });

  it('returns empty string for empty value', () => {
    const fmt = findCol('created_at').valueFormatter as Formatter;
    expect(fmt(fmtParams(''))).toBe('');
  });
});

describe('valueFormatter — is_repeat_session', () => {
  it('returns valRepeat key when value is true and data exists', () => {
    const fmt = findCol('is_repeat_session').valueFormatter as Formatter;
    expect(fmt(fmtParams(true, {}))).toBe('valRepeat');
  });

  it('returns valNew key when value is false and data exists', () => {
    const fmt = findCol('is_repeat_session').valueFormatter as Formatter;
    expect(fmt(fmtParams(false, {}))).toBe('valNew');
  });

  it('returns empty string when data is undefined (loading row)', () => {
    const fmt = findCol('is_repeat_session').valueFormatter as Formatter;
    expect(fmt(fmtParams(true, undefined))).toBe('');
  });
});

describe('valueFormatter — is_refunded', () => {
  it('returns valRefundedYes key when refunded and data exists', () => {
    const fmt = findCol('is_refunded').valueFormatter as Formatter;
    expect(fmt(fmtParams(true, {}))).toBe('valRefundedYes');
  });

  it('returns valRefundedNo key when not refunded and data exists', () => {
    const fmt = findCol('is_refunded').valueFormatter as Formatter;
    expect(fmt(fmtParams(false, {}))).toBe('valRefundedNo');
  });

  it('returns empty string when data is undefined (loading row)', () => {
    const fmt = findCol('is_refunded').valueFormatter as Formatter;
    expect(fmt(fmtParams(true, undefined))).toBe('');
  });
});

describe('cellStyle — is_repeat_session', () => {
  it('returns null for loading row (data undefined)', () => {
    const cellStyle = findCol('is_repeat_session').cellStyle as CellStyleFn;
    expect(cellStyle({ data: undefined, value: true })).toBeNull();
  });

  it('returns style object for loaded row', () => {
    const cellStyle = findCol('is_repeat_session').cellStyle as CellStyleFn;
    expect(cellStyle({ data: {}, value: true })).toBeTruthy();
  });
});

describe('cellStyle — refund_amount', () => {
  it('returns null for loading row', () => {
    const cellStyle = findCol('refund_amount').cellStyle as CellStyleFn;
    expect(cellStyle({ data: undefined, value: 10 })).toBeNull();
  });

  it('returns negative color style when value > 0', () => {
    const cellStyle = findCol('refund_amount').cellStyle as CellStyleFn;
    const style = cellStyle({ data: {}, value: 10 }) as Record<string, string>;
    expect(style.color).toContain('negative');
  });

  it('returns muted color style when value is 0', () => {
    const cellStyle = findCol('refund_amount').cellStyle as CellStyleFn;
    const style = cellStyle({ data: {}, value: 0 }) as Record<string, string>;
    expect(style.color).toContain('placeholder');
  });
});

describe('cellStyle — is_refunded', () => {
  it('returns null for loading row', () => {
    const cellStyle = findCol('is_refunded').cellStyle as CellStyleFn;
    expect(cellStyle({ data: undefined, value: true })).toBeNull();
  });

  it('returns negative color when refunded', () => {
    const cellStyle = findCol('is_refunded').cellStyle as CellStyleFn;
    const style = cellStyle({ data: {}, value: true }) as Record<string, string>;
    expect(style.color).toContain('negative');
  });
});

describe('DEFAULT_COL_DEF', () => {
  it('has resizable true', () => {
    expect(DEFAULT_COL_DEF.resizable).toBe(true);
  });

  it('has sortable false by default', () => {
    expect(DEFAULT_COL_DEF.sortable).toBe(false);
  });
});
