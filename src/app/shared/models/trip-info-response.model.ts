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
  id: number;
  acReg: string;
  flightNo: string;
  depDateTime: string;
  sentBy: string;
  sentDateTime: string;
}
