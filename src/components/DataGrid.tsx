import { useCallback, useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, CellValueChangedEvent } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import { generateData, type ProductRow } from "../utils/generateData";
import { calcRevenue, calcProfit, getStatus } from "../utils/calculations";
import ChipRenderer from "./ChipRenderer";
import CalculationRenderer from "./CalculationRenderer";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DataGrid() {
  const rowData = useMemo(() => generateData(10000), []);

  const columnDefs = useMemo<ColDef<ProductRow>[]>(
    () => [
      { field: "id", headerName: "ID", width: 80, filter: true },
      { field: "product", headerName: "Product", filter: true, sortable: true },
      {
        field: "category",
        headerName: "Category",
        filter: true,
        sortable: true,
        width: 120,
      },
      {
        field: "unitCost",
        headerName: "Unit Cost",
        width: 110,
        valueFormatter: (p) => `$${p.value?.toFixed(2)}`,
      },
      {
        field: "unitPrice",
        headerName: "Unit Price",
        editable: true,
        width: 120,
        valueFormatter: (p) => `$${p.value?.toFixed(2)}`,
        cellStyle: { backgroundColor: "rgba(170, 59, 255, 0.06)" },
      },
      {
        field: "quantity",
        headerName: "Qty",
        editable: true,
        width: 80,
        cellStyle: { backgroundColor: "rgba(170, 59, 255, 0.06)" },
      },
      {
        headerName: "Revenue",
        colId: "revenue",
        width: 130,
        valueGetter: (p) =>
          p.data ? calcRevenue(p.data.unitPrice, p.data.quantity) : 0,
        cellRenderer: CalculationRenderer,
        sortable: true,
      },
      {
        headerName: "Profit",
        colId: "profit",
        width: 130,
        valueGetter: (p) =>
          p.data
            ? calcProfit(p.data.unitPrice, p.data.unitCost, p.data.quantity)
            : 0,
        cellRenderer: CalculationRenderer,
        sortable: true,
      },
      {
        headerName: "Status",
        colId: "status",
        width: 120,
        valueGetter: (p) =>
          p.data
            ? getStatus(
                calcProfit(p.data.unitPrice, p.data.unitCost, p.data.quantity),
              )
            : "",
        cellRenderer: ChipRenderer,
        sortable: true,
      },
      {
        field: "inStock",
        headerName: "In Stock",
        width: 100,
        sortable: true,
      },
    ],
    [],
  );

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    event.api.refreshCells({
      rowNodes: [event.node],
      columns: ["revenue", "profit", "status"],
      force: true,
    });
  }, []);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: false,
      resizable: true,
    }),
    [],
  );

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      data-testid="grid-container"
      className="ag-theme-balham-dark"
    >
      <AgGridReact<ProductRow>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        getRowId={(params) => String(params.data.id)}
      />
    </div>
  );
}
