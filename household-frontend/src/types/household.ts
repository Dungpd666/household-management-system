export interface Household {
  id?: number;
  householdCode: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  householdType: string;
  members?: Array<{ id: number; fullName: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}
