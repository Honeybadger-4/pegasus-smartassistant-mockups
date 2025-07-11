export interface IReportsResponse {
  content: IReportsContentData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface IReportsContentData {
  id: number;
  aircraftReg: string;
  flightNo: string;
  depPort: string;
  arrPort: string;
  depDateTime: string | null;
  arrDateTime: string | null;
  createdBy: string;
  enteredDate: string | null;
  doorClosed: string | null;
  offBlock: string | null;
  takeOff: string | null;
  landing: string | null;
  onBlock: string | null;
  doorOpen: string | null;
  flightHours: string;
  blockHours: string;
  adult: number;
  child: number;
  infant: number;
  pickUpPax: number;
  nonRevenue: number;
  deIcing: boolean;
  remainingFuel: number;
  ofpFuel: number;
  upliftFuel: number;
  upliftTime: string;
  density: number;
  totalFuel: number;
  gaugesSumAfter: number;
  landingFuel: number;
  excessFuelReasons: string;
  oilBeforeEngOne: number;
  oilBeforeEngTwo: number;
  oilAfterEngOne: number;
  oilAfterEngTwo: number;
  landingWindReport: string;
  isHydGreenChecked: boolean;
  isHydBlueChecked: boolean;
  isHydYellowChecked: boolean;
  divertAirportCode: string;
  divertAirportIcao: string;
  autolandInfoMessage: string;
  delayReasons: [
    {
      code: string;
      delayedTime: string;
      comment: string;
    },
  ];
}
