import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CalculationRenderer, {
  formatCurrency,
} from "../components/CalculationRenderer";
import type { CustomCellRendererProps } from "ag-grid-react";

describe("formatCurrency", () => {
  it("formats positive numbers with $ and commas", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative numbers", () => {
    expect(formatCurrency(-99.9)).toBe("$-99.90");
  });

  it("formats large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });
});

describe("CalculationRenderer", () => {
  it("renders formatted positive value", () => {
    const props = { value: 1500 } as CustomCellRendererProps;
    render(<CalculationRenderer {...props} />);
    const el = screen.getByTestId("calculation-value");
    expect(el).toHaveTextContent("$1,500.00");
    expect(el).not.toHaveStyle({ color: "#ef4444" });
  });

  it("renders negative value in red", () => {
    const props = { value: -50 } as CustomCellRendererProps;
    render(<CalculationRenderer {...props} />);
    const el = screen.getByTestId("calculation-value");
    expect(el).toHaveTextContent("$-50.00");
    expect(el).toHaveStyle({ color: "#ef4444" });
  });

  it("renders nothing for null value", () => {
    const props = { value: null } as CustomCellRendererProps;
    const { container } = render(<CalculationRenderer {...props} />);
    expect(container.innerHTML).toBe("");
  });
});
