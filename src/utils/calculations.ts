import { DataRow } from '../types/data';

export function calculateSubtotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

export function calculateTotal(subtotal: number, discount: number): number {
  return Math.round(subtotal * (1 - discount / 100) * 100) / 100;
}

export function calculateStatus(
  total: number,
  isActive: boolean,
  quantity: number
): string {
  // Order matters: check specific conditions before general ones
  if (total < 50) {
    return 'Warning';
  }
  if (!isActive) {
    return 'Pending';
  }
  // Check Completed before High Priority (more specific condition)
  if (total > 500 && quantity > 10) {
    return 'Completed';
  }
  if (total > 1000) {
    return 'High Priority';
  }
  return 'Normal';
}

export function recalculateRow(row: DataRow): DataRow {
  const subtotal = calculateSubtotal(row.quantity, row.unitPrice);
  const total = calculateTotal(subtotal, row.discount);
  const status = calculateStatus(total, row.isActive, row.quantity);

  return {
    ...row,
    subtotal,
    total,
    status,
  };
}

