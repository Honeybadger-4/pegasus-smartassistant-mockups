export interface ILoginInfoResponse {
  content: [ILoginInfoTableData];
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
  totalPages: number;
  totalElements: number;
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

export interface ILoginInfoTableData {
  appVersion: string;
  channel: string;
  companyId: number;
  deviceBrand: string;
  deviceId: string;
  deviceModel: string;
  ipAddress: string;
  loggedInDate: string;
  os: string;
  osVersion: string;
  userId: number;
  username: string;
}