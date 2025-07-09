export interface IAircraftChecklistResponse {
  content: IAircraftChecklistContentData[];
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

export interface IAircraftChecklistContentData {
  melItems: boolean;
  legIsn: number;
  aircraftReg: string;
  flightNo: string;
  depPort: string;
  arrPort: string;
  depDateTime: string | null;
  arrDateTime: string | null;
  dailyCheck: boolean;
  preflightCheck: boolean;
  defferedItems: boolean;
  fluidUplift: boolean;
  securitySearch: boolean;
  confirmedBy: string;
  confirmedDateTime: string | null;
}


