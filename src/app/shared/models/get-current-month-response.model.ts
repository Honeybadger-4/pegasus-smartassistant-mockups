export interface IGetCurrentMonthResponse {
        totalNumberOfLog: number,
        flightLog: number,
        simLog: number,
        pairings: [
            {
                dutyType: string,
                aircraftReg: string,
                legIsn: number,
                aircraftType: number,
                departure: string,
                arrival: string,
                engineType: string,
                departureTime: string,
                arrivalTime: string,
                totalTime: string,
                multiPilotTime: string,
                pic: null,
                landing: string,
                night: string,
                ifr: string
            },
        ],
        trainings: [
            {
                dutyType: string,
                legIsn: number,
                trainingDate: string,
                timeOfSession: string,
                signer: null,
                description: null,
                type: null,
                remarksAndEndorsement: null
            }
        ]
}