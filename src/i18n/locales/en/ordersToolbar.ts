/**
 * @fileoverview Translations for the OrdersGridToolbar component.
 * Loaded lazily when OrdersGridToolbar mounts.
 *
 * Interpolation syntax: `{key}` — e.g. '{count} rows' → '1,234 rows'
 */

const en = {
  toolbarAriaLabel: 'Orders grid toolbar',
  searchPlaceholder: 'Quick search…',
  searchAriaLabel: 'Quick search orders',
  resetFiltersLabel: 'Reset filters',
  resetFiltersAriaLabel: 'Reset all column filters',
  editedLabel: '{count} edited',
  editedAriaLabel: '{count} rows have unsaved local edits',
  rowCount: '{count} rows',
} as const;

export type OrdersToolbarTranslations = Record<keyof typeof en, string>;

export default en;
