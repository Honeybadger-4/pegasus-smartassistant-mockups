export interface IDetailedListResponse {
  logbookDetails: {
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
  };
  currentPageTotal: string;
  allPagesTotal: string;
  previousPagesTotal: string;
}

export interface IDetailedListContentData {
  logId: number;
  companyId: number;
  crewName: string;
  date: string;
  dutyType: string;
  aircraftType: string;
  aircraftReg: string;
  departure: string;
  departureTime: string;
  arrival: string;
  arrivalTime: string;
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
  night: string | null;
  ifr: string | null;
  engineType: string;
  instructor: string;
  remarksAndEndorsements: string;
  canReassign: boolean;
  lastReviewedAdmin: string;
  updatedDate: string;
  uploadReason: string;
  changes: any;
}
