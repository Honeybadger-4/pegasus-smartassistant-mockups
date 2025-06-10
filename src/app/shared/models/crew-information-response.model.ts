export interface ICrewInformationResponse {
  content: ICrewInformationContentData[];
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

export interface ICrewInformationContentData {
  acReg: string;
  flightNo: string;
  depPort: string;
  depDateTime: string | null;
  arrPort: string;
  arrDateTime: string | null;
  crewFullName: string;
  companyId: number;
  leg: string;
  dutyType: string;
  dutyStart: string;
  addDutyTime: string;
  pass: boolean;
  pf: string;
  pm: string;
  decisionOfPilot: string;
}
