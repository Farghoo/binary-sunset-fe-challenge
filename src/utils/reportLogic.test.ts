import { marginOf, profitOf, statusOf } from "./reportLogic";

describe("reportLogic", () => {
  test("profitOf returns revenue - cost", () => {
    expect(profitOf({ revenue: 1000, cost: 250 })).toBe(750);
    expect(profitOf({ revenue: 0, cost: 10 })).toBe(-10);
  });

  test("marginOf handles revenue=0", () => {
    expect(marginOf({ revenue: 0, cost: 10 })).toBe(0);
  });

  test("statusOf returns Inactive when not active", () => {
    expect(statusOf({ isActive: false, revenue: 1000, cost: 100 })).toBe(
      "Inactive"
    );
  });

  test("statusOf returns Critical when profit < 0", () => {
    expect(statusOf({ isActive: true, revenue: 100, cost: 200 })).toBe(
      "Critical"
    );
  });

  test("statusOf returns Warning for low profit", () => {
    expect(statusOf({ isActive: true, revenue: 1000, cost: 600 })).toBe(
      "Warning"
    ); // profit=400
  });

  test("statusOf returns High for high profit and margin", () => {
    expect(statusOf({ isActive: true, revenue: 20000, cost: 10000 })).toBe(
      "High"
    ); // profit=10000, margin=0.5
  });

  test("statusOf returns Ok otherwise", () => {
    expect(statusOf({ isActive: true, revenue: 2000, cost: 1200 })).toBe("Ok"); // profit=800 margin=0.4 but profit not >5000
  });
});
