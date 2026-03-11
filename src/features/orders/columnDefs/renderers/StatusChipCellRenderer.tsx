/**
 * @fileoverview AG Grid cell renderer — Status chip.
 *
 * Renders an `OrderStatus` value as a `StatusChip` badge.
 * Color is driven by CSS variables (no hardcoding here).
 * Accessibility: chip uses role="img" with aria-label in StatusChip.
 */

import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';
import type { ICellRendererParams } from 'ag-grid-community';

import StatusChip from '@/shared/components/StatusChip';

import type { OrderAnalyticsRow, OrderStatus } from '../../types/orders.types';
import { STATUS_CHIP_CONFIG } from '../../utils/statusHelpers';

const StatusChipCellRenderer = React.memo(function StatusChipCellRenderer(
  params: ICellRendererParams<OrderAnalyticsRow>
) {
  const status = params.value as OrderStatus;
  const config = STATUS_CHIP_CONFIG[status];
  if (!config) return null;

  return (
    <div className={styles.cellCenter}>
      <StatusChip
        variant={config.variant}
        label={config.label}
        icon={config.icon}
        aria-label={config.ariaLabel}
      />
    </div>
  );
});

export default StatusChipCellRenderer;
