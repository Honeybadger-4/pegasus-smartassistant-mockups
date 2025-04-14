export interface IDailyCountItem {
    day: string;
    total: number;
  }
  
  export interface IDailyCountResponse {
    data: IDailyCountItem[];
  }
  