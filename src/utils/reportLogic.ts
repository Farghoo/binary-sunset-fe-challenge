import type { Row, Status } from "../types/row";

export function profitOf(row: Pick<Row, "revenue" | "cost">): number {
  return row.revenue - row.cost;
}

export function marginOf(row: Pick<Row, "revenue" | "cost">): number {
  if (row.revenue === 0) return 0;
  return profitOf(row) / row.revenue;
}

export function statusOf(
  row: Pick<Row, "isActive" | "revenue" | "cost">
): Status {
  if (!row.isActive) return "Inactive";

  const profit = profitOf(row);
  const margin = marginOf(row);

  if (profit < 0) return "Critical";
  if (profit < 500 || margin < 0.1) return "Warning";
  if (profit > 5000 && margin > 0.3) return "High";
  return "Ok";
}
