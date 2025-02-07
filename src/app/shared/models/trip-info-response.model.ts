export interface ITripInfoResponse {
  content: [ITripInfoTableData];
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

export interface ITripInfoTableData {
  username: string;
  legIsn: number;
  depDateTime: string;
  depPort: string;
  arrPort: string;
  flightNo: string;
  aircraftReg: string;
  arrDateTime: string;
  pantryCode: string;
  crewVersion: string;
  tripFuel: number;
  taxiFuel: number;
  eet: string;
  pax: string;
  takeOffTime: string;
  status: string;
}



