/**
 * @fileoverview StatusChip — reusable pill-shaped badge component.
 *
 * Design notes:
 * - Colors driven entirely by CSS custom properties (zero hardcoded values)
 * - Icon is decorative (`aria-hidden`) — label carries the meaning for a11y
 * - `variant` maps to a CSS modifier class in StatusChip.module.scss
 * - Fully reusable: not tied to any feature domain
 *
 * @example
 * <StatusChip variant="excellent" label="Excellent" icon="↑" />
 * <StatusChip variant="mobile"    label="Mobile"    icon="📱" size="md" />
 */

import React from 'react';
import styles from '@/styles/components/StatusChip.module.scss';
import clsx from 'clsx';

export interface StatusChipProps {
  /** CSS modifier variant — maps to `.chip--{variant}` in the SCSS module. */
  variant: string;
  /** Human-readable label. Accessible text — do not rely on icon alone. */
  label: string;
  /** Optional decorative icon rendered before the label. `aria-hidden` is set automatically. */
  icon?: string;
  /** Visual size of the chip. @default 'sm' */
  size?: 'sm' | 'md';
  /** Additional class names for layout overrides from the parent. */
  className?: string;
}

/**
 * A pill-shaped status badge with variant-driven colors.
 * All colors come from CSS custom properties — retheme via `_variables.scss`.
 */
const StatusChip = React.memo(function StatusChip({
  variant,
  label,
  icon,
  size = 'sm',
  className,
}: StatusChipProps) {
  return (
    <span
      className={clsx(
        styles.chip,
        styles[`chip--${variant}`],
        size === 'md' && styles['chip--md'],
        className
      )}
      role="img"
      aria-label={label}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </span>
  );
});

export default StatusChip;
