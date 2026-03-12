import { memo } from "react";
import type { ICellRendererParams } from "ag-grid-community";

type Props = ICellRendererParams<any, number>;

function formatNumber(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "";
}

export const CalculationRenderer = memo(function CalculationRenderer(
  props: Props
) {
  const v = props.value ?? 0;
  const cls = v < 0 ? "calc calc--neg" : "calc";
  return <span className={cls}>{formatNumber(v)}</span>;
});
