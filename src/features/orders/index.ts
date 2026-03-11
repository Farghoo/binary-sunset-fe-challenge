/**
 * @fileoverview Orders feature barrel.
 *
 * Re-exports the public API of the orders feature.
 * External consumers (pages, router) import from here — never from deep paths.
 * This enforces the architecture boundary checked by ESLint `no-restricted-imports`.
 */

export { OrdersProvider, useOrders } from './context/OrdersContext';
export { default as OrdersGrid } from './components/OrdersGrid/OrdersGrid';
export { default as OrdersGridToolbar } from './components/OrdersGridToolbar/OrdersGridToolbar';
