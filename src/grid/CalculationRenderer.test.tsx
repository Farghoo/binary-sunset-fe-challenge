import { render, screen } from "@testing-library/react";
import { CalculationRenderer } from "./CalculationRenderer";

const paramsOf = (value: any) => ({ value } as any);

describe("CalculationRenderer", () => {
  test("formats number to 2 decimals", () => {
    render(<CalculationRenderer {...paramsOf(12.3456)} />);
    expect(screen.getByText("12.35")).toBeTruthy();
  });

  test("adds negative class for negatives", () => {
    const { container } = render(<CalculationRenderer {...paramsOf(-1.2)} />);
    const el = container.querySelector(".calc");
    expect(el?.className).toContain("calc--neg");
  });
});
