import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChipRenderer from "../components/ChipRenderer";
import type { CustomCellRendererProps } from "ag-grid-react";

function renderChip(value: string) {
  const props = { value } as CustomCellRendererProps;
  render(<ChipRenderer {...props} />);
}

describe("ChipRenderer", () => {
  it("renders Loss chip with red styling", () => {
    renderChip("Loss");
    const chip = screen.getByTestId("chip-loss");
    expect(chip).toHaveTextContent("Loss");
    expect(chip).toHaveStyle({ background: "#fecaca" });
  });

  it("renders Warning chip with orange styling", () => {
    renderChip("Warning");
    const chip = screen.getByTestId("chip-warning");
    expect(chip).toHaveTextContent("Warning");
    expect(chip).toHaveStyle({ background: "#fde68a" });
  });

  it("renders Profitable chip with green styling", () => {
    renderChip("Profitable");
    const chip = screen.getByTestId("chip-profitable");
    expect(chip).toHaveTextContent("Profitable");
    expect(chip).toHaveStyle({ background: "#bbf7d0" });
  });
});
