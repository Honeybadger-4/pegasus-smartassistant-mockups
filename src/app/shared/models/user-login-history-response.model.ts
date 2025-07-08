export interface IUserLoginHistoryResponse {
  content: IUserLoginHistoryContentData[];
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

export interface IUserLoginHistoryContentData {
  appVersion: string;
  channel: string;
  companyId: number;
  deviceBrand: string;
  deviceId: string;
  deviceModel: string;
  ipAddress: string;
  loggedInDate: string | null;
  os: string;
  osVersion: string;
  userId: number;
  username: string;
}
