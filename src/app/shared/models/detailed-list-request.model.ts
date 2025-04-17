export interface IDetailedListRequest {
  monthLogId: number;
  date?: string,
  aircraftType?: string,
  aircraftReg?: string,
  departure?: string,
  departureTime?: string,
  arrival?: string,
  arrivalTime?: string
  lastReviewedAdmin?: string
  status?: string;
}
