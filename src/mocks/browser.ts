/**
 * @fileoverview MSW browser worker setup.
 *
 * Imported only in development when VITE_USE_MOCK_DATA=true.
 * Tree-shaken out of production builds automatically.
 */

import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
