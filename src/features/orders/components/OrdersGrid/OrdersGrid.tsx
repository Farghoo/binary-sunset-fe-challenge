/**
 * @fileoverview AG Grid wrapper for the Orders Analytics feature.
 *
 * Responsibilities:
 *  - Renders AG Grid in infinite row model (20 rows per page)
 *  - Shows a React-controlled loading overlay while the first page is in flight
 *    (initial load, search, or reset) — prevents blank placeholder rows
 *  - Shows error state with translated strings
 *  - For scroll-triggered blocks, `ag-row-loading` CSS handles the shimmer
 *
 * Performance notes:
 *  - Grid is always in DOM so the datasource fires immediately on mount
 *  - `getRowId` enables O(1) `node.setData()` updates
 *  - `animateRows: false` — avoids animation overhead at 10k+ rows
 */

import React, { useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import styles from '@/styles/features/orders/OrdersGrid.module.scss';

import { useTranslation } from '@/i18n';
import EmptyState from '@/shared/components/EmptyState';

import { DEFAULT_COL_DEF, getOrderColumnDefs } from '../../columnDefs/orderColumnDefs';
import { useOrders } from '../../context/OrdersContext';
import { useOrdersGrid } from '../../hooks/useOrdersGrid';

/**
 * AG Grid Orders table — infinite row model.
 * Must be rendered inside `<OrdersProvider>`.
 */
const OrdersGrid = React.memo(function OrdersGrid() {
  const { datasource, isPageLoading, totalRows, error } = useOrders();
  const gridCallbacks = useOrdersGrid();
  const { t } = useTranslation('ordersGrid');

  // Rebuild column defs when language changes so headers re-render
  const columnDefs = useMemo(() => getOrderColumnDefs(t), [t]);

  if (error) {
    return (
      <EmptyState
        icon="⚠"
        title={t('errorTitle')}
        description={error.message}
        action={{ label: t('retryLabel'), onClick: () => window.location.reload() }}
      />
    );
  }

  if (!isPageLoading && totalRows === 0) {
    return <EmptyState icon="🔍" title={t('emptyTitle')} description={t('emptyDescription')} />;
  }

  return (
    <div
      className={`${styles.gridWrapper} ag-theme-alpine`}
      role="region"
      aria-label={t('gridAriaLabel')}
    >
      {/* React-controlled overlay: covers the grid while the first page loads.
          Grid stays mounted so the datasource fires immediately. */}
      {isPageLoading && (
        <div className={styles.loadingOverlay} role="status" aria-label={t('loadingAriaLabel')}>
          <CircularProgress size={40} aria-hidden="true" />
          <p className={styles.loadingText}>{t('loadingText')}</p>
        </div>
      )}

      <AgGridReact
        datasource={datasource}
        rowModelType="infinite"
        cacheBlockSize={20}
        maxConcurrentDatasourceRequests={1}
        columnDefs={columnDefs}
        defaultColDef={DEFAULT_COL_DEF}
        getRowId={gridCallbacks.getRowId}
        onGridReady={gridCallbacks.onGridReady}
        onCellEditingStopped={gridCallbacks.onCellEditingStopped}
        rowHeight={42}
        headerHeight={44}
        animateRows={false}
        enableCellTextSelection
        stopEditingWhenCellsLoseFocus
      />
    </div>
  );
});

export default OrdersGrid;
