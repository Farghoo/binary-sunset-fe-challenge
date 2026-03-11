/**
 * @fileoverview AG Grid column definitions for the Orders Analytics grid.
 *
 * `getOrderColumnDefs(t)` is a factory — pass the typed `t` from
 * `useTranslation('ordersGrid')` so headers update on language change.
 *
 * Design principles:
 * - No hardcoded colors in cellStyle — all styling via SCSS modules
 * - Editable columns clearly marked with `editable: true` and amber styling
 * - Accessibility: headerTooltip, aria-label on renderers, keyboard-friendly editors
 * - Open/Closed: add a new column by appending to the relevant group array.
 */

import type { ColDef, ValueFormatterParams } from 'ag-grid-community';

import type { OrdersGridTranslations } from '@/i18n/locales/en/ordersGrid';
import { formatUsd } from '@/shared/utils/formatters';

import type { OrderAnalyticsRow } from '../types/orders.types';
import {
  DeviceChipCellRenderer,
  MarginCellRenderer,
  ProfitCellRenderer,
  SourceChipCellRenderer,
  StatusChipCellRenderer,
} from './renderers';

// ---------------------------------------------------------------------------
// t function type — matches useTranslation('ordersGrid') return
// ---------------------------------------------------------------------------

type TFn = (key: keyof OrdersGridTranslations) => string;

// ---------------------------------------------------------------------------
// Reusable value formatters (locale-independent)
// ---------------------------------------------------------------------------

const usdFormatter = (p: ValueFormatterParams<OrderAnalyticsRow, number>) =>
  p.value !== undefined && p.value !== null ? formatUsd(p.value) : '';

const dateFormatter = (p: ValueFormatterParams<OrderAnalyticsRow, string>) => {
  if (!p.value) return '';
  try {
    return new Date(p.value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return p.value;
  }
};

// ---------------------------------------------------------------------------
// Factory — call with t() from useTranslation('ordersGrid')
// ---------------------------------------------------------------------------

export function getOrderColumnDefs(t: TFn): ColDef<OrderAnalyticsRow>[] {
  return [
    // ── Identity ────────────────────────────────────────────────────────────
    {
      headerName: t('colOrderId'),
      field: 'order_id',
      width: 90,
      pinned: 'left',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellStyle: {
        fontFamily: 'var(--font-family-mono)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-muted)',
      },
    },
    {
      headerName: t('colItemId'),
      field: 'order_item_id',
      width: 80,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellStyle: {
        fontFamily: 'var(--font-family-mono)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-placeholder)',
      },
    },
    {
      headerName: t('colDate'),
      field: 'created_at',
      width: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter,
    },

    // ── Product ─────────────────────────────────────────────────────────────
    {
      headerName: t('colProduct'),
      field: 'product_name',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: { fontWeight: 'var(--font-weight-medium)' },
    },

    // ── Session ─────────────────────────────────────────────────────────────
    {
      headerName: t('colDevice'),
      field: 'device_type',
      width: 110,
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: DeviceChipCellRenderer,
    },
    {
      headerName: t('colSource'),
      field: 'utm_source',
      width: 100,
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: SourceChipCellRenderer,
    },
    {
      headerName: t('colCampaign'),
      field: 'utm_campaign',
      width: 110,
      sortable: true,
      filter: 'agSetColumnFilter',
      cellStyle: { fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' },
    },
    {
      headerName: t('colRepeat'),
      field: 'is_repeat_session',
      width: 100,
      sortable: true,
      filter: 'agSetColumnFilter',
      valueFormatter: (p) => {
        if (p.data === undefined) return '';
        return p.value ? t('valRepeat') : t('valNew');
      },
      cellStyle: (p) => {
        if (p.data === undefined) return null;
        return {
          color: p.value ? 'var(--color-status-good-fg)' : 'var(--color-text-placeholder)',
          fontWeight: p.value ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
          fontSize: 'var(--font-size-xs)',
        };
      },
    },

    // ── Financial ───────────────────────────────────────────────────────────
    {
      headerName: t('colPrice'),
      field: 'price_usd',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 0, max: 9999, precision: 2 },
      valueFormatter: usdFormatter,
      headerTooltip: t('tooltipPrice'),
      cellStyle: {
        fontWeight: 'var(--font-weight-semibold)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      },
    },
    {
      headerName: t('colCogs'),
      field: 'cogs_usd',
      width: 100,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: usdFormatter,
      cellStyle: {
        textAlign: 'right',
        color: 'var(--color-text-muted)',
        fontVariantNumeric: 'tabular-nums',
      },
    },
    {
      headerName: t('colRefund'),
      field: 'refund_amount',
      width: 100,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: usdFormatter,
      cellStyle: (p) => {
        if (p.data === undefined) return null;
        return {
          textAlign: 'right',
          color: p.value > 0 ? 'var(--color-negative)' : 'var(--color-text-placeholder)',
          fontVariantNumeric: 'tabular-nums',
        };
      },
    },
    {
      headerName: t('colQty'),
      field: 'items_purchased',
      width: 70,
      sortable: true,
      filter: 'agNumberColumnFilter',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 1, max: 10, precision: 0 },
      headerTooltip: t('tooltipQty'),
      cellStyle: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
    },

    // ── Calculated ──────────────────────────────────────────────────────────
    {
      headerName: t('colRevenue'),
      field: 'revenue',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: usdFormatter,
      cellStyle: {
        textAlign: 'right',
        fontWeight: 'var(--font-weight-semibold)',
        fontVariantNumeric: 'tabular-nums',
      },
    },
    {
      headerName: t('colProfit'),
      field: 'profit',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: ProfitCellRenderer,
    },
    {
      headerName: t('colMargin'),
      field: 'margin_pct',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: MarginCellRenderer,
    },

    // ── Status ──────────────────────────────────────────────────────────────
    {
      headerName: t('colStatus'),
      field: 'status',
      width: 115,
      pinned: 'right',
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: StatusChipCellRenderer,
    },
    {
      headerName: t('colRefunded'),
      field: 'is_refunded',
      width: 90,
      sortable: true,
      filter: 'agSetColumnFilter',
      valueFormatter: (p) => {
        if (p.data === undefined) return '';
        return p.value ? t('valRefundedYes') : t('valRefundedNo');
      },
      cellStyle: (p) => {
        if (p.data === undefined) return null;
        return {
          color: p.value ? 'var(--color-negative)' : 'var(--color-text-placeholder)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: p.value ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
        };
      },
    },
  ];
}

/** Shared default column config applied to every column unless overridden. */
export const DEFAULT_COL_DEF: ColDef<OrderAnalyticsRow> = {
  resizable: true,
  sortable: false,
  filter: false,
  suppressMovable: false,
  menuTabs: ['filterMenuTab', 'columnsMenuTab'],
};
