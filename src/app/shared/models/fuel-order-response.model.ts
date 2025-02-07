export interface IFuelOrderResponse {
  content: [IFuelOrderTableData];
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

export interface IFuelOrderTableData {
  legIsn: number;
  depDateTime: string;
  depPort: string;
  arrPort: string;
  flightNo: string;
  aircraftReg: string;
  arrDateTime: string;
  amount: number;
  userName: string;
  orderDateTime:string;
}
