import {
  calculateSubtotal,
  calculateTotal,
  calculateStatus,
  recalculateRow,
} from '../calculations';
import { DataRow } from '../../types/data';

describe('calculations', () => {
  describe('calculateSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      expect(calculateSubtotal(10, 25.5)).toBe(255);
      expect(calculateSubtotal(5, 100)).toBe(500);
      expect(calculateSubtotal(0, 100)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with discount correctly', () => {
      expect(calculateTotal(100, 10)).toBe(90);
      expect(calculateTotal(200, 25)).toBe(150);
      expect(calculateTotal(100, 0)).toBe(100);
    });
  });

  describe('calculateStatus', () => {
    it('should return Warning for low total', () => {
      expect(calculateStatus(30, true, 5)).toBe('Warning');
    });

    it('should return High Priority for high total with low quantity', () => {
      expect(calculateStatus(1500, true, 5)).toBe('High Priority');
    });

    it('should return Completed for high total with high quantity (priority over High Priority)', () => {
      // When total > 1000 AND quantity > 10, Completed takes priority
      expect(calculateStatus(33018.33, true, 81)).toBe('Completed');
      expect(calculateStatus(1500, true, 15)).toBe('Completed');
    });

    it('should return Pending for inactive items', () => {
      expect(calculateStatus(100, false, 5)).toBe('Pending');
    });

    it('should return Completed for high total and quantity', () => {
      expect(calculateStatus(600, true, 15)).toBe('Completed');
    });

    it('should return Normal for standard values', () => {
      expect(calculateStatus(200, true, 5)).toBe('Normal');
    });
  });

  describe('recalculateRow', () => {
    it('should recalculate all dependent fields', () => {
      const row: DataRow = {
        id: 'test-1',
        productName: 'Test Product',
        quantity: 10,
        unitPrice: 50,
        discount: 10,
        isActive: true,
        category: 'Electronics',
        subtotal: 0,
        total: 0,
        status: 'Normal',
      };

      const recalculated = recalculateRow(row);

      expect(recalculated.subtotal).toBe(500);
      expect(recalculated.total).toBe(450);
      expect(recalculated.status).toBe('Normal');
    });

    it('should update status based on calculated total', () => {
      const row: DataRow = {
        id: 'test-2',
        productName: 'Test Product',
        quantity: 5,
        unitPrice: 5,
        discount: 0,
        isActive: true,
        category: 'Electronics',
        subtotal: 0,
        total: 0,
        status: 'Normal',
      };

      const recalculated = recalculateRow(row);

      expect(recalculated.total).toBe(25);
      expect(recalculated.status).toBe('Warning');
    });
  });
});

