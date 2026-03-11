import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';
import type { ICellRendererParams } from 'ag-grid-community';

import StatusChip from '@/shared/components/StatusChip';

import type { DeviceType, OrderAnalyticsRow } from '../../types/orders.types';
import { DEVICE_CHIP_CONFIG } from '../../utils/statusHelpers';

const DeviceChipCellRenderer = React.memo(function DeviceChipCellRenderer(
  params: ICellRendererParams<OrderAnalyticsRow>
) {
  const device = params.value as DeviceType;
  const config = DEVICE_CHIP_CONFIG[device];
  if (!config) return null;

  return (
    <div className={styles.cellCenter}>
      <StatusChip variant={config.variant} label={config.label} icon={config.icon} />
    </div>
  );
});

export default DeviceChipCellRenderer;
