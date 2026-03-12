import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DataGrid from "../components/DataGrid";

// Mock generateData to return a small dataset for tests
vi.mock("../utils/generateData", () => ({
  generateData: () => [
    {
      id: 1,
      product: "Test Widget",
      category: "Electronics",
      unitCost: 10,
      unitPrice: 25,
      quantity: 100,
      inStock: true,
    },
    {
      id: 2,
      product: "Test Gadget",
      category: "Sports",
      unitCost: 50,
      unitPrice: 40,
      quantity: 10,
      inStock: false,
    },
  ],
}));

describe("DataGrid", () => {
  it("renders the grid container", () => {
    render(<DataGrid />);
    expect(screen.getByTestId("grid-container")).toBeInTheDocument();
  });

  it("renders column headers", async () => {
    render(<DataGrid />);
    // AG Grid renders headers asynchronously
    await vi.waitFor(() => {
      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Unit Price")).toBeInTheDocument();
      expect(screen.getByText("Qty")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("Profit")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });
  });
});
