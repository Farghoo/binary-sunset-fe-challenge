import { generateDataRow, generateDataset } from '../dataGenerator';
import { DataRow } from '../../types/data';

describe('dataGenerator', () => {
  describe('generateDataRow', () => {
    it('should generate a valid data row', () => {
      const row = generateDataRow(0);

      expect(row).toHaveProperty('id');
      expect(row).toHaveProperty('productName');
      expect(row).toHaveProperty('quantity');
      expect(row).toHaveProperty('unitPrice');
      expect(row).toHaveProperty('discount');
      expect(row).toHaveProperty('isActive');
      expect(row).toHaveProperty('category');
      expect(row).toHaveProperty('subtotal');
      expect(row).toHaveProperty('total');
      expect(row).toHaveProperty('status');
    });

    it('should generate unique IDs', () => {
      const row1 = generateDataRow(0);
      const row2 = generateDataRow(1);

      expect(row1.id).not.toBe(row2.id);
      expect(row1.id).toBe('row-0');
      expect(row2.id).toBe('row-1');
    });

    it('should calculate subtotal and total correctly', () => {
      const row = generateDataRow(0);

      const expectedSubtotal = row.quantity * row.unitPrice;
      const expectedTotal = expectedSubtotal * (1 - row.discount / 100);

      expect(Math.abs(row.subtotal - expectedSubtotal)).toBeLessThan(0.01);
      expect(Math.abs(row.total - expectedTotal)).toBeLessThan(0.01);
    });

    it('should have valid status values', () => {
      const row = generateDataRow(0);
      const validStatuses = ['High Priority', 'Pending', 'Completed', 'Warning', 'Normal'];

      expect(validStatuses).toContain(row.status);
    });
  });

  describe('generateDataset', () => {
    it('should generate the correct number of rows', () => {
      const dataset = generateDataset(100);
      expect(dataset).toHaveLength(100);
    });

    it('should generate 10000 rows by default', () => {
      const dataset = generateDataset();
      expect(dataset.length).toBeGreaterThanOrEqual(10000);
    });

    it('should generate unique IDs for all rows', () => {
      const dataset = generateDataset(100);
      const ids = dataset.map((row) => row.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(100);
    });

    it('should generate rows with valid data types', () => {
      const dataset = generateDataset(10);

      dataset.forEach((row) => {
        expect(typeof row.id).toBe('string');
        expect(typeof row.productName).toBe('string');
        expect(typeof row.quantity).toBe('number');
        expect(typeof row.unitPrice).toBe('number');
        expect(typeof row.discount).toBe('number');
        expect(typeof row.isActive).toBe('boolean');
        expect(typeof row.category).toBe('string');
        expect(typeof row.subtotal).toBe('number');
        expect(typeof row.total).toBe('number');
        expect(typeof row.status).toBe('string');
      });
    });
  });
});

