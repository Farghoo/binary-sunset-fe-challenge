import { memo } from "react";
import type { ICellRendererParams } from "ag-grid-community";
import type { Status } from "../types/row";

type Props = ICellRendererParams<any, Status | string>;

function classFor(value: Status | string) {
  switch (value) {
    case "High":
      return "chip chip--high";
    case "Ok":
      return "chip chip--ok";
    case "Warning":
      return "chip chip--warning";
    case "Critical":
      return "chip chip--critical";
    case "Inactive":
      return "chip chip--inactive";
    default:
      return "chip chip--neutral";
  }
}

function iconFor(value: Status | string) {
  switch (value) {
    case "High":
      return "⭐";
    case "Ok":
      return "✅";
    case "Warning":
      return "⚠️";
    case "Critical":
      return "⛔";
    case "Inactive":
      return "🚫";
    default:
      return "🏷️";
  }
}

export const ChipsRenderer = memo(function ChipsRenderer(props: Props) {
  const value = props.value ?? "";
  return (
    <span className={classFor(value)} title={String(value)}>
      <span className="chip__icon" aria-hidden="true">
        {iconFor(value)}
      </span>
      <span className="chip__label">{String(value)}</span>
    </span>
  );
});
