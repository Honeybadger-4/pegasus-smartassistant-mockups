export interface IFlightPlansResponse {
  content: IFlightPlan[];
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

export interface IFlightPlan {
  id: number;
  acReg: string;
  flightNo: string;
  depDateTime: string | null;
  receivedDateTime: string | null;
  version: string;
  responsibleUser: string;
  status: string;
  approvedDateTime: string | null;
  replacedDateTime: string | null;
  declinedDateTime: string | null;
  submittedDateTime: string | null;
}
