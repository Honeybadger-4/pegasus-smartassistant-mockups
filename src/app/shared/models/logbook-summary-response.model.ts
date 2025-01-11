export interface ILogbookSummaryResponse {
    boeingSummary: {
        totalDuties: number,
        totalHours: number,
        monthlyDetails: [
            {
                yearMonth: string,
                dutyCount: number,
                totalHours: number
            }
        ]
    },
    airbusSummary: {
        totalDuties: number,
        totalHours: number,
        monthlyDetails: [
            {
                yearMonth: string,
                dutyCount: number,
                totalHours: number
            }
        ]
    },
    trainingSummary: {
        totalTrainings: number,
        totalHours: number,
        monthlyDetails: [
            {
                yearMonth: string,
                dutyCount: number,
                totalHours: number
            }
        ]
    }
}