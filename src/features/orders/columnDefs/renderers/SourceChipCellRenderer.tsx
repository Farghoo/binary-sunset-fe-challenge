import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';
import type { ICellRendererParams } from 'ag-grid-community';

import StatusChip from '@/shared/components/StatusChip';

import type { OrderAnalyticsRow } from '../../types/orders.types';
import { getSourceChipConfig } from '../../utils/statusHelpers';

const SourceChipCellRenderer = React.memo(function SourceChipCellRenderer(
  params: ICellRendererParams<OrderAnalyticsRow>
) {
  if (!params.data) return null;
  const source = params.value as string;
  const config = getSourceChipConfig(source);

  return (
    <div className={styles.cellCenter}>
      <StatusChip variant={config.variant} label={config.label} icon={config.icon} />
    </div>
  );
});

export default SourceChipCellRenderer;
