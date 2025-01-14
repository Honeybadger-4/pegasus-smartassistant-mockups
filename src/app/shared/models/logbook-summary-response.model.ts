export interface ILogbookSummaryResponse {
  boeingSummary: {
    totalDuties: number;
    totalHours: number;
    monthlyDetails: [
      {
        yearMonth: string;
        dutyCount: number;
        totalHours: number;
        logbookType: string;
      },
    ];
  };
  airbusSummary: {
    totalDuties: number;
    totalHours: number;
    monthlyDetails: [
      {
        yearMonth: string;
        dutyCount: number;
        totalHours: number;
        logbookType: string;
      },
    ];
  };
  trainingSummary: {
    totalTrainings: number;
    totalHours: number;
    monthlyDetails: [
      {
        yearMonth: string;
        dutyCount: number;
        totalHours: number;
        logbookType: string;
      },
    ];
  };
}
