/**
 * @fileoverview Translations for the OrdersGrid component.
 * Loaded lazily when OrdersGrid mounts.
 */

const en = {
  gridAriaLabel: 'Orders analytics data grid',
  loadingAriaLabel: 'Loading orders…',
  loadingText: 'Loading orders…',
  errorTitle: 'Failed to load orders',
  emptyTitle: 'No orders found',
  emptyDescription: 'No data matched your current filters. Try resetting the filters.',
  retryLabel: 'Retry',

  colOrderId: 'Order #',
  colItemId: 'Item #',
  colDate: 'Date',
  colProduct: 'Product',
  colDevice: 'Device',
  colSource: 'Source',
  colCampaign: 'Campaign',
  colRepeat: 'Repeat',
  colPrice: 'Price (USD)',
  colCogs: 'COGS',
  colRefund: 'Refund',
  colQty: 'Qty',
  colRevenue: 'Revenue',
  colProfit: 'Profit',
  colMargin: 'Margin %',
  colStatus: 'Status',
  colRefunded: 'Refunded',

  tooltipPrice: 'Editable — click to change price. Profit and status update automatically.',
  tooltipQty: 'Editable — click to change quantity.',

  valRepeat: '✓ Repeat',
  valNew: 'New',
  valRefundedYes: '✕ Yes',
  valRefundedNo: '—',
} as const;

export type OrdersGridTranslations = Record<keyof typeof en, string>;

export default en;
