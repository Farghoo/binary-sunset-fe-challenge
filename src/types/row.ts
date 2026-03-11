export type Status = "High" | "Ok" | "Warning" | "Critical" | "Inactive";

export type Row = {
  id: string;
  employeeName: string;
  department: string;
  isActive: boolean;
  revenue: number;
  cost: number;
  year: number;
  status?: Status;
};
