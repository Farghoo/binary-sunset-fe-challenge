import { mapApiRecordsToRows, mapApiRecordToRow } from '@/features/orders/mappers/orderMapper';

const validRaw = {
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

describe('mapApiRecordToRow', () => {
  it('returns a valid row for well-formed data', () => {
    const row = mapApiRecordToRow(validRaw);
    expect(row).not.toBeNull();
    expect(row?.order_item_id).toBe(1);
    expect(row?.product_name).toBe('Test Product');
    expect(row?.status).toBe('excellent');
  });

  it('returns null for missing required field', () => {
    const { product_name: _p, ...invalid } = validRaw;
    expect(mapApiRecordToRow(invalid)).toBeNull();
  });

  it('returns null for invalid status value', () => {
    const result = mapApiRecordToRow({ ...validRaw, status: 'unknown_status' });
    expect(result).toBeNull();
  });

  it('returns null for invalid device_type', () => {
    const result = mapApiRecordToRow({ ...validRaw, device_type: 'smartwatch' });
    expect(result).toBeNull();
  });

  it('returns null for null input', () => {
    expect(mapApiRecordToRow(null)).toBeNull();
  });

  it('returns null for non-object input', () => {
    expect(mapApiRecordToRow('string')).toBeNull();
    expect(mapApiRecordToRow(42)).toBeNull();
  });

  it('accepts optional _id field', () => {
    const row = mapApiRecordToRow({ ...validRaw, _id: 'abc123' });
    expect(row).not.toBeNull();
  });

  it('applies default "direct" for missing utm_source', () => {
    const { utm_source: _u, ...withoutSource } = validRaw;
    const row = mapApiRecordToRow(withoutSource);
    expect(row?.utm_source).toBe('direct');
  });
});

describe('mapApiRecordsToRows', () => {
  it('maps all valid records', () => {
    const { rows, skippedCount } = mapApiRecordsToRows([validRaw, validRaw]);
    expect(rows).toHaveLength(2);
    expect(skippedCount).toBe(0);
  });

  it('filters out invalid records and counts them', () => {
    const invalid = { ...validRaw, status: 'bad' };
    const { rows, skippedCount } = mapApiRecordsToRows([validRaw, invalid, validRaw]);
    expect(rows).toHaveLength(2);
    expect(skippedCount).toBe(1);
  });

  it('returns empty rows and zero skipped for empty input', () => {
    const { rows, skippedCount } = mapApiRecordsToRows([]);
    expect(rows).toHaveLength(0);
    expect(skippedCount).toBe(0);
  });

  it('counts all records as skipped when all are invalid', () => {
    const { rows, skippedCount } = mapApiRecordsToRows([null, undefined, 'bad']);
    expect(rows).toHaveLength(0);
    expect(skippedCount).toBe(3);
  });
});
