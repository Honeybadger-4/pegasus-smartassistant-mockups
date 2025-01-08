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
  status: string;
  username: string;
  legIsn: number;
  depPort: string;
  arrPort: string;
  flightNo: string;
  aircraftReg: string;
}
