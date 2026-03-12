import type { CustomCellRendererProps } from "ag-grid-react";
import type { Status } from "../utils/calculations";

const CHIP_STYLES: Record<Status, { background: string; color: string }> = {
  Loss: { background: "#fecaca", color: "#991b1b" },
  Warning: { background: "#fde68a", color: "#92400e" },
  Profitable: { background: "#bbf7d0", color: "#166534" },
};

export default function ChipRenderer(props: CustomCellRendererProps) {
  const status = props.value as Status;
  const style = CHIP_STYLES[status];

  if (!style) return null;

  return (
    <span
      data-testid={`chip-${status.toLowerCase()}`}
      style={{
        ...style,
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-block",
        lineHeight: "20px",
      }}
    >
      {status}
    </span>
  );
}
