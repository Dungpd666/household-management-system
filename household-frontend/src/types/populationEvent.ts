export interface PopulationEvent {
  id?: number;
  type: string;
  description?: string;
  eventDate: string;
  personId: number;
  person?: {
    id: number;
    fullName: string;
  };
}
