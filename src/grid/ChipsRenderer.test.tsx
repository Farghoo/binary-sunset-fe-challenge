import { render, screen } from "@testing-library/react";
import { ChipsRenderer } from "./ChipsRenderer";

const paramsOf = (value: any) => ({ value } as any);

describe("ChipsRenderer", () => {
  test("renders label", () => {
    render(<ChipsRenderer {...paramsOf("Warning")} />);
    expect(screen.getByText("Warning")).toBeTruthy();
  });

  test("applies correct class for status", () => {
    const { container } = render(<ChipsRenderer {...paramsOf("Critical")} />);
    const el = container.querySelector(".chip");
    expect(el?.className).toContain("chip--critical");
  });
});
