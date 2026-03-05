import { DataRow } from '../types/data';

const PRODUCT_NAMES = [
  'Laptop Pro',
  'Wireless Mouse',
  'Mechanical Keyboard',
  'USB-C Cable',
  'Monitor 27"',
  'Webcam HD',
  'Headphones',
  'USB Drive 64GB',
  'Power Bank',
  'Tablet Stand',
  'HDMI Cable',
  'Ethernet Adapter',
  'USB Hub',
  'Laptop Stand',
  'Screen Protector',
];

const CATEGORIES = ['Electronics', 'Accessories', 'Cables', 'Peripherals', 'Storage'];

export function generateDataRow(index: number): DataRow {
  const productName = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
  const quantity = Math.floor(Math.random() * 100) + 1;
  const unitPrice = Math.round((Math.random() * 500 + 10) * 100) / 100;
  const discount = Math.round(Math.random() * 20 * 100) / 100;
  const isActive = Math.random() > 0.3;
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const subtotal = quantity * unitPrice;
  const total = subtotal * (1 - discount / 100);
  
  // Status based on total value
  let status = 'Normal';
  if (total < 50) {
    status = 'Warning';
  } else if (total > 1000) {
    status = 'High Priority';
  } else if (!isActive) {
    status = 'Pending';
  } else if (total > 500) {
    status = 'Completed';
  }

  return {
    id: `row-${index}`,
    productName,
    quantity,
    unitPrice,
    discount,
    isActive,
    category,
    subtotal,
    total,
    status,
  };
}

export function generateDataset(size: number = 10000): DataRow[] {
  return Array.from({ length: size }, (_, index) => generateDataRow(index));
}

