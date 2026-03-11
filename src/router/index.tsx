/**
 * @fileoverview Application router.
 *
 * All routes are defined here. Adding a new page:
 *  1. Create the page component under `src/pages/`
 *  2. Add its path constant to `src/constants/routes.ts`
 *  3. Add a `<Route>` entry below.
 *
 * React.lazy + Suspense enables code-splitting per route — large pages
 * (like the grid) don't block the initial bundle.
 */

import { lazy, Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import { ROUTES } from '@/constants/routes';

const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
      role="status"
      aria-label="Loading page…"
    >
      <CircularProgress />
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect root → /orders */}
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.ORDERS} replace />} />

        <Route
          path={ROUTES.ORDERS}
          element={
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          }
        />

        <Route
          path={ROUTES.NOT_FOUND}
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
