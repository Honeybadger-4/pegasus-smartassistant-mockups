export interface ILogbookUsageResponse {
  content: ILogbookUsageContent[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ILogbookUsageContent {
  userName: string;
  simRecordsToBeSigned: number;
  signedSimRecord: number;
  flightRecordsToBeSigned: number;
  signedFlightRecord: number;
}
