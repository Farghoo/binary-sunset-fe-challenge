import { numberValueSetter } from "./valueSetters";
import type { Row } from "../types/row";

describe("numberValueSetter", () => {
  test("updates numeric field and returns true", () => {
    const row: Row = {
      id: "1",
      productName: "Nova Desk 1",
      category: "SaaS",
      isActive: true,
      revenue: 100,
      cost: 50,
      year: 2026,
    };

    const setter = numberValueSetter("revenue");
    const changed = setter({ data: row, newValue: 200 } as any);

    expect(changed).toBe(true);
    expect(row.revenue).toBe(200);
  });

  test("rejects non-numeric input", () => {
    const row = { revenue: 100 } as any;
    const setter = numberValueSetter("revenue");
    const changed = setter({ data: row, newValue: "abc" } as any);
    expect(changed).toBe(false);
    expect(row.revenue).toBe(100);
  });

  test("returns false when value unchanged", () => {
    const row = { revenue: 100 } as any;
    const setter = numberValueSetter("revenue");
    const changed = setter({ data: row, newValue: 100 } as any);
    expect(changed).toBe(false);
  });
});
