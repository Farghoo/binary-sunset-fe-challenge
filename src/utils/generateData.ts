export interface ProductRow {
  id: number;
  product: string;
  category: string;
  unitCost: number;
  unitPrice: number;
  quantity: number;
  inStock: boolean;
}

const PRODUCTS = [
  "USB-C Cable",
  "Laptop Stand",
  "Shorts",
  "T-Shirt",
  "Running Shoes",
  "Basketball",
  "Chips",
  "Water",
  "Chair",
  "Desk"
];

const CATEGORIES = ["Electronics", "Clothing", "Food", "Sports", "Home"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateData(count = 10000): ProductRow[] {
  const rows: ProductRow[] = [];

  for (let i = 0; i < count; i++) {
    const unitCost = randomFloat(1, 200);
    const markup = randomFloat(0.8, 2.5);
    const unitPrice = parseFloat((unitCost * markup).toFixed(2));

    rows.push({
      id: i + 1,
      product: PRODUCTS[randomInt(0, PRODUCTS.length - 1)],
      category: CATEGORIES[randomInt(0, CATEGORIES.length - 1)],
      unitCost,
      unitPrice,
      quantity: randomInt(0, 500),
      inStock: Math.random() > 0.15,
    });
  }

  return rows;
}
