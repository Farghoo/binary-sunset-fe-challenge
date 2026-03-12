export type Status = "High" | "Ok" | "Warning" | "Critical" | "Inactive";

export type Row = {
  id: string;
  productName: string;
  category: string;
  isActive: boolean;
  revenue: number;
  cost: number;
  year: number;
  status?: Status;
};
