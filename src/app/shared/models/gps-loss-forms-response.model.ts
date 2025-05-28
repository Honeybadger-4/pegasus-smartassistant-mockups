export interface IGpsLossFormsResponse {
  content: IGpsLossFormContentData[];
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

export interface IGpsLossFormContentData {
  id: number;
  legIsn: number;
  acReg: string;
  flightNo: string;
  depPort: string;
  arrPort: string;
  depDateTime: string | null;
  arrDateTime: string | null;
  firstPointName: string;
  lastPointName: string;
  time: string;
  flightLevel: number;
  duration: string;
  flightPhase: string;
  impacts: string[];
}
