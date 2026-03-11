/**
 * @fileoverview Application route constants.
 *
 * All route paths defined here. Use these constants in `<Link to={ROUTES.orders}>`
 * and `<Route path={ROUTES.orders}>` — never hard-code strings in components.
 */
export const ROUTES = {
  ROOT: '/',
  ORDERS: '/orders',
  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
