import type { CustomCellRendererProps } from "ag-grid-react";

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CalculationRenderer(props: CustomCellRendererProps) {
  const value = props.value as number;

  if (value == null) return null;

  const isNegative = value < 0;

  return (
    <span
      data-testid="calculation-value"
      style={{ color: isNegative ? "#ef4444" : "inherit", fontWeight: 500 }}
    >
      {formatCurrency(value)}
    </span>
  );
}
