export interface ILogbookCrewListResponse {
    content: [ILogbookCrewListContentData],
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        offset: number,
        paged: boolean,
        unpaged: boolean
    },
    last: boolean,
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface ILogbookCrewListContentData {
    monthlyLogbookId: number,
    crewNameSurname: string,
    companyId: number,
    totalNumberOfLog: number,
    flightLog: number,
    simulatorFlightLogs: number,
    approvedLogs: number,
    reassignedLogs: number
}