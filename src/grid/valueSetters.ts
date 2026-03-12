import type { ValueSetterParams } from "ag-grid-community";
import type { Row } from "../types/row";

export function numberValueSetter(field: "revenue" | "cost") {
  return (params: ValueSetterParams<Row>) => {
    if (!params.data) return false;

    const newValueRaw = params.newValue;
    const newValue =
      typeof newValueRaw === "number" ? newValueRaw : Number(newValueRaw);

    if (!Number.isFinite(newValue)) return false;

    const oldValue = params.data[field];
    if (oldValue === newValue) return false;

    params.data[field] = newValue;
    return true;
  };
}
