/**
 * @fileoverview Orders-domain chip configuration maps.
 *
 * Maps domain values (OrderStatus, DeviceType, utm_source) to
 * `IChipDisplayConfig` display metadata consumed by `StatusChip`.
 *
 * No colors are stored here — `variant` drives CSS modifier classes
 * that read from CSS custom properties in `_variables.scss`.
 *
 * SRP: this file only handles domain value → display metadata mapping.
 * Financial calculations live in `./calculations.ts`.
 */

import type { IChipDisplayConfig } from '@/shared/interfaces/IChipDisplayConfig';

import type { DeviceType, OrderStatus } from '../types/orders.types';

// ---------------------------------------------------------------------------
// Order status chip configs
// ---------------------------------------------------------------------------

export const STATUS_CHIP_CONFIG: Record<OrderStatus, IChipDisplayConfig> = {
  excellent: {
    variant: 'excellent',
    label: 'Excellent',
    icon: '↑',
    ariaLabel: 'Status: Excellent — high profit margin',
  },
  good: {
    variant: 'good',
    label: 'Good',
    icon: '→',
    ariaLabel: 'Status: Good — healthy profit margin',
  },
  warning: {
    variant: 'warning',
    label: 'Warning',
    icon: '⚠',
    ariaLabel: 'Status: Warning — low profit margin',
  },
  loss: {
    variant: 'loss',
    label: 'Loss',
    icon: '↓',
    ariaLabel: 'Status: Loss — negative profit',
  },
};

// ---------------------------------------------------------------------------
// Device chip configs
// ---------------------------------------------------------------------------

export const DEVICE_CHIP_CONFIG: Record<DeviceType, IChipDisplayConfig> = {
  desktop: {
    variant: 'desktop',
    label: 'Desktop',
    icon: '🖥',
    ariaLabel: 'Device: Desktop',
  },
  mobile: {
    variant: 'mobile',
    label: 'Mobile',
    icon: '📱',
    ariaLabel: 'Device: Mobile',
  },
};

// ---------------------------------------------------------------------------
// UTM source chip configs
// ---------------------------------------------------------------------------

const SOURCE_CHIP_CONFIG: Record<string, IChipDisplayConfig> = {
  gsearch: {
    variant: 'google',
    label: 'Google',
    icon: 'G',
    ariaLabel: 'Traffic source: Google Search',
  },
  bsearch: {
    variant: 'bing',
    label: 'Bing',
    icon: 'B',
    ariaLabel: 'Traffic source: Bing Search',
  },
  socialbook: {
    variant: 'social',
    label: 'Social',
    icon: '◈',
    ariaLabel: 'Traffic source: Social media',
  },
  direct: {
    variant: 'direct',
    label: 'Direct',
    icon: '→',
    ariaLabel: 'Traffic source: Direct',
  },
};

/**
 * Returns chip display config for a UTM source value.
 * Falls back to a generic "direct" config for unknown sources.
 *
 * @param source - Raw utm_source string from the API
 */
export function getSourceChipConfig(source: string): IChipDisplayConfig {
  return (
    SOURCE_CHIP_CONFIG[source.toLowerCase()] ?? {
      variant: 'direct',
      label: source,
      icon: '?',
      ariaLabel: `Traffic source: ${source}`,
    }
  );
}
