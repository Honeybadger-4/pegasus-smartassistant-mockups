export interface IFlightInformationResponse {
  content: [IFlightInformationTableData];
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
  totalPages: number;
  totalElements: number;
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

export interface IFlightInformationTableData {
  flightPlanId: number;
  legIsn: number;
  aircraftReg: string;
  flightNo: string;
  depPort: string;
  arrPort: string;
  depDateTime: string;
  arrDateTime: string;
  user: string | null;
  flightPlanStatus: string | null;
  altRoute: string | null;
  fuelOrder: string | null;
  loadSheetStatus: string | null;
  isTripInfoSent: boolean;
}
