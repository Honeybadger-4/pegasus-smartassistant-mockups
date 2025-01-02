export interface IDetailedListResponse {
  content: [IDetailedListContentData];
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

export interface IDetailedListContentData {
  logId: number;
  companyId: number;
  crewName: string;
  date: string;
  flightVersion: string;
  aircraftType: string;
  aircraftReg: string;
  departure: string;
  depTime: string;
  arrival: string;
  arrTime: string;
  totalTime: string;
  status: string;
  pic: string | null;
  multiPilotTime: string;
  dayLanding: string | null;
  nightLanding: string | null;
  syntheticTrainingDate: string | null;
  syntheticTrainingType: string | null;
  syntheticTrainingTime: string | null;
  pilotFunctionPic: string;
  pilotFunctionCoPilot: string;
  pilotFunctionDual: string | null;
  nightTime: string | null;
  ifrTime: string | null;
}
