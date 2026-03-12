import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi, CellValueChangedEvent } from "ag-grid-community";

import type { Row } from "../types/row";
import { generateRows } from "../utils/generateRows";
import { profitOf, marginOf, statusOf } from "../utils/reportLogic";
import { ChipsRenderer } from "./ChipsRenderer";
import { CalculationRenderer } from "./CalculationRenderer";
import { numberValueSetter } from "./valueSetters";
import { isE2EEnv } from "../utils/env";

const isE2E = isE2EEnv();

export function LeaveGrid() {
  const [rowData] = useState<Row[]>(() => generateRows(20000, 2026));
  const apiRef = useRef<GridApi | null>(null);

  const columnDefs = useMemo<ColDef<Row>[]>(() => {
    return [
      { field: "id", headerName: "ID", width: 90, sortable: true },
      {
        field: "productName",
        headerName: "Product",
        minWidth: 220,
        sortable: true,
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 160,
        cellRenderer: ChipsRenderer,
        sortable: true,
      },
      {
        field: "isActive",
        headerName: "Active",
        width: 110,
        sortable: true,
      },

      {
        field: "revenue",
        headerName: "Revenue",
        width: 140,
        editable: true,
        cellEditor: "agNumberCellEditor",
        valueSetter: numberValueSetter("revenue"),
      },
      {
        field: "cost",
        headerName: "Cost",
        width: 140,
        editable: true,
        cellEditor: "agNumberCellEditor",
        valueSetter: numberValueSetter("cost"),
      },

      // Calculated columns
      {
        colId: "profit_calc",
        headerName: "Profit",
        valueGetter: (p) => (p.data ? profitOf(p.data) : 0),
        cellRenderer: CalculationRenderer,
        sortable: true,
      },
      {
        colId: "margin_calc",
        headerName: "Margin",
        valueGetter: (p) => (p.data ? marginOf(p.data) : 0),
        cellRenderer: CalculationRenderer,
        sortable: true,
      },
      {
        colId: "status_chip",
        headerName: "Status",
        valueGetter: (p) => (p.data ? statusOf(p.data) : "Inactive"),
        cellRenderer: ChipsRenderer,
        sortable: true,
      },
    ];
  }, []);

  const defaultColDef = useMemo<ColDef<Row>>(
    () => ({
      resizable: true,
      filter: true,
      sortable: true,
    }),
    []
  );

  const onGridReady = (params: { api: GridApi }) => {
    apiRef.current = params.api;
  };

  const onCellValueChanged = (e: CellValueChangedEvent<Row>) => {
    // Ensure dependent calculated cells + chips repaint for this row only.
    e.api.refreshCells({
      rowNodes: [e.node],
      columns: ["profit", "margin", "status"],
      force: true,
    });
  };

  return (
    <div
      data-cy="leave-grid"
      style={{ height: "80vh", width: "100%" }}
      className="ag-theme-quartz"
    >
      <AgGridReact<Row>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        getRowId={(p) => p.data.id}
        rowBuffer={10}
        animateRows={false}
        suppressColumnVirtualisation={isE2E}
      />
    </div>
  );
}
