export interface IFlightInfoTripInfoResponse {
  leg_isn: number;
  origin_id: number;
  aircraft_registration: string;
  crew_version: string;
  pantry_code: string;
  dow: number;
  doi: number;
  eic_adj: string | null;
  ind_effect: string | null;
  mzfw: number;
  mtow: number;
  mlw: number;
  maltow: number;
  block_fuel: number;
  taxi_fuel: number;
  trip_fuel: number;
  takeoff_time: string | null;
  eet: string;
  submitted_by_txt: string;
  submitted: string;
  version: number;
}
