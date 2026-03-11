/**
 * @fileoverview Profit cell renderer.
 *
 * Displays profit with a directional arrow.
 * Colors come from CSS custom properties — never hardcoded.
 * Arrow is aria-hidden; value provides the accessible content.
 */

import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';
import type { ICellRendererParams } from 'ag-grid-community';
import clsx from 'clsx';

import { formatUsd } from '@/shared/utils/formatters';

import type { OrderAnalyticsRow } from '../../types/orders.types';

const ProfitCellRenderer = React.memo(function ProfitCellRenderer(
  params: ICellRendererParams<OrderAnalyticsRow>
) {
  const profit = params.value as number;
  if (profit === null || profit === undefined) return null;

  const colorClass =
    profit > 20
      ? styles.profitPositiveHigh
      : profit > 0
        ? styles.profitPositiveLow
        : styles.profitNegative;

  const arrow = profit > 0 ? '▲' : profit < 0 ? '▼' : '—';

  return (
    <div className={clsx(styles.cellEnd, colorClass)} aria-label={`Profit: ${formatUsd(profit)}`}>
      <span className={styles.profitArrow} aria-hidden="true">
        {arrow}
      </span>
      <span>{formatUsd(profit)}</span>
    </div>
  );
});

export default ProfitCellRenderer;
