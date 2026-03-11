/**
 * @fileoverview Margin percentage cell renderer with progress bar.
 *
 * Renders margin_pct as a percentage label + visual progress bar.
 * Bar color is driven by `data-status` attribute → CSS custom properties.
 * Screen readers receive the percentage via aria-label — bar is decorative.
 */

import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';
import type { ICellRendererParams } from 'ag-grid-community';

import { formatPercent } from '@/shared/utils/formatters';

import type { OrderAnalyticsRow } from '../../types/orders.types';
import { getStatusFromMargin } from '../../utils/calculations';

const MarginCellRenderer = React.memo(function MarginCellRenderer(
  params: ICellRendererParams<OrderAnalyticsRow>
) {
  const marginPct = params.value as number;
  if (marginPct === null || marginPct === undefined) return null;

  const status = getStatusFromMargin(marginPct);
  const barWidth = Math.max(0, Math.min(100, marginPct));

  return (
    <div className={styles.marginWrapper} aria-label={`Margin: ${formatPercent(marginPct)}`}>
      <div className={styles.marginValue}>{formatPercent(marginPct)}</div>
      <div className={styles.marginBarTrack} aria-hidden="true">
        <div
          className={styles.marginBarFill}
          data-status={status}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
});

export default MarginCellRenderer;
