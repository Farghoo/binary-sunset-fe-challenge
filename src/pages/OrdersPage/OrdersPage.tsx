/**
 * @fileoverview OrdersPage — the primary analytics view.
 *
 * Composes:
 *  - `I18nErrorBoundary` — ErrorBoundary with translated strings from 'common'
 *  - `OrdersProvider`    — supplies server state + edit mutation to the tree
 *  - `OrdersGridToolbar` — search, filter reset, edit badge
 *  - `OrdersGrid`        — 10k+ row AG Grid with inline editing
 */

import React from 'react';

import { useTranslation } from '@/i18n';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { OrdersGrid, OrdersGridToolbar, OrdersProvider } from '@/features/orders';

/**
 * Thin wrapper that injects translated strings into ErrorBoundary.
 * Kept separate so the class component can stay hook-free.
 */
function I18nErrorBoundary({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  return (
    <ErrorBoundary errorTitle={t('errorTitle')} retryLabel={t('retry')}>
      {children}
    </ErrorBoundary>
  );
}

function OrdersPage() {
  return (
    <I18nErrorBoundary>
      <OrdersProvider>
        <OrdersGridToolbar />
        <OrdersGrid />
      </OrdersProvider>
    </I18nErrorBoundary>
  );
}

export default OrdersPage;
