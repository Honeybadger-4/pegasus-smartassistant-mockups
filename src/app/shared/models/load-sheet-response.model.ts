export interface ILoadSheetResponse {
  loadSheets: {
    content: [ILoadSheetTableData];
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
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
  approvedPercentage: number;
}

export interface ILoadSheetTableData {
  id: number;
  acReg: string;
  flightNo: string;
  depPort: string;
  depDateTime: string | null;
  arrDateTime: string | null;

  version: number;
  preparedBy: string;
  checkedBy: string;
  responsibleUser: string;
  status: string;
  approved: string | null;
  replaced: string | null;
  declined: string | null;
  hasLmc: boolean;
}
