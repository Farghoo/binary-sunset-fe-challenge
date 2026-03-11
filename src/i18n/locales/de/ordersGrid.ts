import type { OrdersGridTranslations } from '../en/ordersGrid';

const de: OrdersGridTranslations = {
  gridAriaLabel: 'Auftragsanalyse-Datengitter',
  loadingAriaLabel: 'Aufträge werden geladen…',
  loadingText: 'Aufträge werden geladen…',
  errorTitle: 'Aufträge konnten nicht geladen werden',
  emptyTitle: 'Keine Aufträge gefunden',
  emptyDescription:
    'Keine Daten entsprechen Ihren aktuellen Filtern. Versuchen Sie, die Filter zurückzusetzen.',
  retryLabel: 'Erneut versuchen',

  // Column headers
  colOrderId: 'Bestellung #',
  colItemId: 'Artikel #',
  colDate: 'Datum',
  colProduct: 'Produkt',
  colDevice: 'Gerät',
  colSource: 'Quelle',
  colCampaign: 'Kampagne',
  colRepeat: 'Wiederkehrend',
  colPrice: 'Preis (USD)',
  colCogs: 'Selbstkosten',
  colRefund: 'Rückerstattung',
  colQty: 'Menge',
  colRevenue: 'Umsatz',
  colProfit: 'Gewinn',
  colMargin: 'Marge %',
  colStatus: 'Status',
  colRefunded: 'Erstattet',

  // Column tooltips
  tooltipPrice:
    'Bearbeitbar — klicken zum Ändern des Preises. Gewinn und Status werden automatisch aktualisiert.',
  tooltipQty: 'Bearbeitbar — klicken zum Ändern der Menge.',

  // Cell value labels
  valRepeat: '✓ Wiederkehrend',
  valNew: 'Neu',
  valRefundedYes: '✕ Ja',
  valRefundedNo: '—',
};

export default de;
