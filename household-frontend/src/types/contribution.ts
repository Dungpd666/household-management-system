export interface Contribution {
  id?: number;
  type: string;
  amount: number;
  person?: { id: number; fullName: string };
  personId?: number;
  createdAt?: Date;
}
