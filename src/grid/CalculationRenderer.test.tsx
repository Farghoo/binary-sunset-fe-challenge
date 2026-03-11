import { render, screen } from "@testing-library/react";
import { CalculationRenderer } from "./CalculationRenderer";

describe("CalculationRenderer", () => {
  test("formats number to 2 decimals", () => {
    render(<CalculationRenderer value={12.3456 as any} />);
    expect(screen.getByText("12.35")).toBeTruthy();
  });

  test("adds negative class for negatives", () => {
    const { container } = render(<CalculationRenderer value={-1.2 as any} />);
    const el = container.querySelector(".calc");
    expect(el?.className).toContain("calc--neg");
  });
});
