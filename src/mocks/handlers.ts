/**
 * @fileoverview MSW request handlers — mock API contract.
 *
 * Mirrors the real Express API exactly so the app code is unaware
 * it's talking to a mock. Supports offset-based pagination, full-text
 * search, and server-side sorting — same contract as the Express server.
 */

import { http, HttpResponse } from 'msw';

import { API_CONFIG } from '@/config/api.config';

type Row = Record<string, unknown>;

/** Simulated network latency — random delay between 3 s and 7 s per page. */
// const simulateDelay = () =>
//   new Promise<void>((resolve) => setTimeout(resolve, 1_500 + Math.random() * 3_500));

// Lazy-loaded once, kept in memory for the session
let cachedRows: Row[] | null = null;

async function getAllRows(): Promise<Row[]> {
  if (!cachedRows) {
    const mod = await import('../../mock-data/orders.json');
    cachedRows = mod.default as Row[];
  }
  return cachedRows;
}

const SEARCHABLE_FIELDS = [
  'product_name',
  'utm_source',
  'utm_campaign',
  'device_type',
  'status',
  'created_at',
] as const;

function applySearch(rows: Row[], query: string): Row[] {
  if (!query) return rows;
  const q = query.toLowerCase();
  return rows.filter((row) =>
    SEARCHABLE_FIELDS.some((field) =>
      String(row[field] ?? '')
        .toLowerCase()
        .includes(q)
    )
  );
}

function applySort(rows: Row[], sortBy: string, sortDir: string): Row[] {
  if (!sortBy) return rows;
  return [...rows].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal ?? '');
    const bStr = String(bVal ?? '');
    const cmp = aStr.localeCompare(bStr);
    return sortDir === 'asc' ? cmp : -cmp;
  });
}

export const handlers = [
  // GET /api/orders?offset=0&limit=20&search=...&sortBy=...&sortDir=asc
  http.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders}`, async ({ request }) => {
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
    const search = url.searchParams.get('search') ?? '';
    const sortBy = url.searchParams.get('sortBy') ?? '';
    const sortDir = url.searchParams.get('sortDir') ?? 'asc';

    let rows = await getAllRows();
    rows = applySearch(rows, search);
    rows = applySort(rows, sortBy, sortDir);

    const total = rows.length;
    const data = rows.slice(offset, offset + limit);

    return HttpResponse.json({ data, total });
  }),

  // GET /health
  http.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`, () => {
    return HttpResponse.json({ status: 'ok', source: 'msw' });
  }),
];
