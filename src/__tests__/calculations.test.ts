import { describe, it, expect } from "vitest";
import { calcRevenue, calcProfit, getStatus } from "../utils/calculations";

describe("calcRevenue", () => {
  it("returns unitPrice * quantity", () => {
    expect(calcRevenue(10, 5)).toBe(50);
  });

  it("returns 0 when quantity is 0", () => {
    expect(calcRevenue(10, 0)).toBe(0);
  });

  it("handles decimal prices", () => {
    expect(calcRevenue(19.99, 3)).toBeCloseTo(59.97);
  });
});

describe("calcProfit", () => {
  it("returns positive profit when price > cost", () => {
    expect(calcProfit(20, 10, 5)).toBe(50);
  });

  it("returns negative profit when price < cost", () => {
    expect(calcProfit(5, 10, 3)).toBe(-15);
  });

  it("returns 0 when price equals cost", () => {
    expect(calcProfit(10, 10, 100)).toBe(0);
  });

  it("returns 0 when quantity is 0", () => {
    expect(calcProfit(20, 10, 0)).toBe(0);
  });
});

describe("getStatus", () => {
  it('returns "Loss" for negative profit', () => {
    expect(getStatus(-10)).toBe("Loss");
    expect(getStatus(-0.01)).toBe("Loss");
  });

  it('returns "Warning" for profit between 0 and 49.99', () => {
    expect(getStatus(0)).toBe("Warning");
    expect(getStatus(25)).toBe("Warning");
    expect(getStatus(49.99)).toBe("Warning");
  });

  it('returns "Profitable" for profit >= 50', () => {
    expect(getStatus(50)).toBe("Profitable");
    expect(getStatus(1000)).toBe("Profitable");
  });
});
