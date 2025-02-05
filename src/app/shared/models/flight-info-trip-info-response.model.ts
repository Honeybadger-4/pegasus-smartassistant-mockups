export interface IFlightInformationTripInfoResponse {
  legIsn: number;
  aircraftReg: string;
  flightNo:string;
  depPort: string;
  arrPort: string;
  username: string;
  depDateTime: string;
  arrDateTime: string;
  pantryCode: string;
  crewVersion: string;
  tripFuel: number;
  taxiFuel: number;
  eet: string;
  takeOffTime: null;
}
