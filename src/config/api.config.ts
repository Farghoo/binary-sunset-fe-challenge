/**
 * @fileoverview Centralized API configuration.
 *
 * All API endpoints and network defaults live here.
 * Override `VITE_API_BASE_URL` in your `.env.local` to point at a
 * different environment (staging, production, local docker, etc.).
 *
 * @example
 * # .env.local
 * VITE_API_BASE_URL=https://binary-sunset-api.onrender.com
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',

  endpoints: {
    orders: '/api/orders',
    orderStats: '/api/orders/stats',
    health: '/health',
  },

  defaults: {
    /** Number of rows to request in a single call. Backend max: 40 000. */
    limit: 15_000,
    /** Timeout in ms — accounts for Render.com free-tier cold start (~30 s). */
    timeout: 35_000,
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
