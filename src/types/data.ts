export interface DataRow {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  isActive: boolean;
  category: string;
  // Calculated fields
  subtotal: number;
  total: number;
  status: string;
}

