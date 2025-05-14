export interface IPersonalChecklistsResponse {
  content: IPersonalChecklistsContentData[];
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

export interface IPersonalChecklistsContentData {
  aircraftReg: string;
  flightNo: string;
  depDateTime: string;
  approvedDateTime: string;
  checklistConfirmed: string;
  status: string;
}
