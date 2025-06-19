export interface ILicenceInfoResponse {
  content: ILicenceInfoContentData[];
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

export interface ILicenceInfoContentData {
  acReg: string;
  flightNo: string;
  arrPort: string;
  arrTime: string | null;
  depPort: string;

  depTime: string | null;
  checkedDate: string | null;
  checkedBy: string;
  licenceListResponse: {
    licenseList: {
      licenceName: string;
      issueDate: string | null;
      expDate: string | null;
    }[];
  };
}
