/**
 * @fileoverview TanStack Query key factory.
 *
 * Centralizing query keys prevents key collision and makes
 * cache invalidation deterministic across the app.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */
export const QUERY_KEYS = {
  orders: {
    all: ['orders'] as const,
    list: (limit: number) => ['orders', 'list', limit] as const,
    stats: ['orders', 'stats'] as const,
  },
} as const;
