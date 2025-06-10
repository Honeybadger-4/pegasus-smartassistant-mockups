export interface IFuelOrderResponse {
  content: IFuelOrderContentData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface IFuelOrderContentData {
  acReg: string;
  flightNo: string;
  depPort: string;
  depDateTime: string | null;
  arrPort: string;
  arrDateTime: string | null;
  amount: number;
  user: string;
  orderDateTime: string | null;
}
