export interface Contribution {
  id?: number;
  type: string;
  amount: number;
  dueDate?: string | Date | null;
  paid: boolean;
  paidAt?: string | Date | null;
  householdId: number;
  createdAt?: string | Date;
}
