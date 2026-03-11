/**
 * @fileoverview EmptyState — generic zero-data placeholder component.
 *
 * Used when a list/grid has no rows to display, e.g. after filtering
 * returns no matches or when a dataset is empty on first load.
 *
 * Fully reusable — accepts any title, description, icon, and optional
 * action button. Not tied to any specific feature domain.
 *
 * @example
 * <EmptyState
 *   title="No orders found"
 *   description="Try adjusting your filters."
 *   icon="🔍"
 *   action={{ label: 'Reset filters', onClick: handleReset }}
 * />
 */

import React from 'react';
import styles from '@/styles/components/EmptyState.module.scss';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Short, prominent heading. */
  title: string;
  /** Optional longer explanation shown below the title. */
  description?: string;
  /** Decorative icon or emoji. `aria-hidden` is set automatically. */
  icon?: string;
  /** Optional primary action button. */
  action?: EmptyStateAction;
}

/**
 * Centered empty state for grids, lists, and data views.
 */
const EmptyState = React.memo(function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
});

export default EmptyState;
