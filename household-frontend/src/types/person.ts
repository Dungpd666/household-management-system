export interface Person {
  id?: number;
  fullName: string;
  dateOfBirth: Date | string;
  gender: string;
  identificationNumber: string;
  relationshipWithHead?: string;
  occupation?: string;
  educationLevel?: string;
  migrationStatus?: string;
  isDeceased?: boolean;
  email?: string;
  household?: { id: number; householdCode: string };
  createdAt?: Date;
  updatedAt?: Date;
}
