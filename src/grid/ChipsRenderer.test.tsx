import { render, screen } from "@testing-library/react";
import { ChipsRenderer } from "./ChipsRenderer";

function renderChip(value: string) {
  // minimal fake params object
  return render(<ChipsRenderer value={value as any} />);
}

describe("ChipsRenderer", () => {
  test("renders label", () => {
    renderChip("Warning");
    expect(screen.getByText("Warning")).toBeTruthy();
  });

  test("applies correct class for status", () => {
    const { container } = renderChip("Critical");
    const el = container.querySelector(".chip");
    expect(el).toBeTruthy();
    expect(el?.className).toContain("chip--critical");
  });

  test("renders neutral for unknown", () => {
    const { container } = renderChip("SomethingElse");
    const el = container.querySelector(".chip");
    expect(el?.className).toContain("chip--neutral");
  });
});
