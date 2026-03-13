export type Status = "Loss" | "Warning" | "Profitable";

export function calcRevenue(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

export function calcProfit(
  unitPrice: number,
  unitCost: number,
  quantity: number,
): number {
  return (unitPrice - unitCost) * quantity;
}

export function getStatus(profit: number): Status {
  if (profit < 0) return "Loss";
  if (profit < 50) return "Warning";
  return "Profitable";
}
