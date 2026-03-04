import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions, ValueGetterParams, CellValueChangedEvent, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { DataRow } from '../types/data';
import { ChipsRenderer } from './renderers/ChipsRenderer';
import { CalculationRenderer } from './renderers/CalculationRenderer';
import { EditableCellRenderer } from './renderers/EditableCellRenderer';
import { recalculateRow } from '../utils/calculations';

interface DataGridProps {
  rowData: DataRow[];
}

export const DataGrid: React.FC<DataGridProps> = ({ rowData }) => {
  const [data, setData] = useState<DataRow[]>(rowData);

  // Sync state with prop when rowData changes
  useEffect(() => {
    setData(rowData);
  }, [rowData]);

  // Memoize value formatters and getters to prevent unnecessary re-renders
  const unitPriceFormatter = useCallback((params: { value?: number }) => {
    return params.value?.toFixed(2) || '0.00';
  }, []);

  const discountFormatter = useCallback((params: { value?: number }) => {
    return params.value?.toFixed(2) || '0.00';
  }, []);

  const currencyFormatter = useCallback((params: { value?: number }) => {
    return `$${params.value?.toFixed(2) || '0.00'}`;
  }, []);

  const subtotalGetter = useCallback((params: ValueGetterParams<DataRow>) => {
    if (!params.data) return 0;
    return params.data.quantity * params.data.unitPrice;
  }, []);

  const totalGetter = useCallback((params: ValueGetterParams<DataRow>) => {
    if (!params.data) return 0;
    const subtotal = params.data.quantity * params.data.unitPrice;
    return subtotal * (1 - (params.data.discount || 0) / 100);
  }, []);

  const statusGetter = useCallback((params: ValueGetterParams<DataRow>) => {
    if (!params.data) return 'Normal';
    const subtotal = params.data.quantity * params.data.unitPrice;
    const total = subtotal * (1 - (params.data.discount || 0) / 100);
    
    // Order matters: check specific conditions before general ones
    if (total < 50) return 'Warning';
    if (!params.data.isActive) return 'Pending';
    // Check Completed before High Priority (more specific condition)
    if (total > 500 && params.data.quantity > 10) return 'Completed';
    if (total > 1000) return 'High Priority';
    return 'Normal';
  }, []);

  const activeCellRenderer = useCallback((params: ICellRendererParams) => {
    return params.value ? '✓' : '✗';
  }, []);

  // Memoize cellRendererParams objects
  const quantityParams = useMemo(() => ({ field: 'quantity' }), []);
  const unitPriceParams = useMemo(() => ({ field: 'unitPrice' }), []);
  const discountParams = useMemo(() => ({ field: 'discount' }), []);

  // Memoize column definitions to prevent unnecessary re-renders
  const columnDefs = useMemo<ColDef<DataRow>[]>(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        width: 120,
        pinned: 'left',
        lockPosition: true,
      },
      {
        headerName: 'Product Name',
        field: 'productName',
        width: 200,
        editable: true,
        cellEditor: 'agTextCellEditor',
      },
      {
        headerName: 'Category',
        field: 'category',
        width: 150,
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        width: 120,
        editable: true,
        cellRenderer: EditableCellRenderer,
        cellRendererParams: quantityParams,
        type: 'numericColumn',
      },
      {
        headerName: 'Unit Price',
        field: 'unitPrice',
        width: 130,
        editable: true,
        cellRenderer: EditableCellRenderer,
        cellRendererParams: unitPriceParams,
        type: 'numericColumn',
        valueFormatter: unitPriceFormatter,
      },
      {
        headerName: 'Discount (%)',
        field: 'discount',
        width: 130,
        editable: true,
        cellRenderer: EditableCellRenderer,
        cellRendererParams: discountParams,
        type: 'numericColumn',
        valueFormatter: discountFormatter,
      },
      {
        headerName: 'Active',
        field: 'isActive',
        width: 100,
        cellRenderer: activeCellRenderer,
      },
      {
        headerName: 'Subtotal',
        field: 'subtotal',
        width: 140,
        cellRenderer: CalculationRenderer,
        valueGetter: subtotalGetter,
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 140,
        cellRenderer: CalculationRenderer,
        valueGetter: totalGetter,
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 180,
        cellRenderer: ChipsRenderer,
        valueGetter: statusGetter,
      },
    ],
    [
      quantityParams,
      unitPriceParams,
      discountParams,
      unitPriceFormatter,
      discountFormatter,
      currencyFormatter,
      subtotalGetter,
      totalGetter,
      statusGetter,
      activeCellRenderer,
    ]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const handleCellValueChanged = useCallback((event: CellValueChangedEvent<DataRow>) => {
    if (!event.data) return;

    const updatedRow = recalculateRow(event.data);
    
    // Update the row data
    event.node.setData(updatedRow);
    
    // Refresh cells to show updated calculated values
    event.api.refreshCells({
      rowNodes: [event.node],
      force: true,
    });
  }, []);

  // getRowId callback for immutable data updates (recommended by AG Grid)
  const getRowId = useCallback((params: { data: DataRow }) => {
    return params.data.id;
  }, []);

  const gridOptions = useMemo<GridOptions<DataRow>>(
    () => ({
      suppressCellFocus: false,
      enableCellChangeFlash: true,
      animateRows: true,
      rowHeight: 50,
      headerHeight: 40,
      onCellValueChanged: handleCellValueChanged,
      getRowId,
    }),
    [handleCellValueChanged, getRowId]
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
        <AgGridReact<DataRow>
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          rowBuffer={10}
          suppressRowClickSelection={true}
          enableRangeSelection={true}
          animateRows={true}
          pagination={false}
          suppressHorizontalScroll={false}
        />
      </div>
    </div>
  );
};

