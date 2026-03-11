/**
 * @fileoverview AG Grid loading cell renderer — shimmer skeleton.
 *
 * Shown in every cell of a row that is still being fetched by the
 * infinite datasource. Replaces the default blank/empty loading state
 * with an animated shimmer bar so the user knows content is incoming.
 */

import React from 'react';
import styles from '@/styles/features/orders/CellRenderers.module.scss';

const LoadingCellRenderer = React.memo(function LoadingCellRenderer() {
  return (
    <div className={styles.cellCenter} aria-hidden="true">
      <div className={styles.skeletonBar} />
    </div>
  );
});

export default LoadingCellRenderer;
