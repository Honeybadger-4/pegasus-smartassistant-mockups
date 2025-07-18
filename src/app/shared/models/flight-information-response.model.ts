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
  aircraftReg: string;
  flightNo: string;
  depPort: string;
  arrPort: string;
  depDateTime: string | null;
  arrDateTime: string | null;
  responsibleUser: string;
  status: string;
  requiredActions: number;
}
