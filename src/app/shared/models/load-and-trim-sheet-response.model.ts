export interface ILoadandTrimSheetResponse {
  loadAndTrimSheet: [
    {
      id: number;
      preparedBy: string;
      checkedBy: string;
      approvedBy: string | "";
      creation_date: string;
      pades_ls_updatedate: string;
      loadSheetVersion: number;
      passengerMassType: string;
      weightUnitType: string;
      cabinDistribution: string;
      totalTrafficLoad: number;
      underLoadBeforeLMC: number;
      dow: number;
      takeoffFuel: number;
      tripFuel: number;
      transitTransferInfo: string;
      TACStatus: string;
      tacDeclineReason: string | null;
      flightInfo: {
        flightDate: string;
        airline_code: string;
        flightNo: string;
        departurePort: string;
        arrivalPort: string;
        acReg: string;
        acType: string;
        acVersion: string;
        crewConfiguration: string;
      };
      loadMessage: {
        ldm: string;
        si: string;
        taxiFuel: number;
      };
      flapInfo: {
        stapTo: string;
        flapText: string | "";
        flapValue: string;
      };
      landingWeight: {
        leastLw: string;
        adj: string | "";
        max: number;
        actual: number;
      };
      takeOffWeight: {
        leastTow: string | "";
        adj: string | "";
        max: number;
        actual: number;
      };
      zeroFuelWeight: {
        leastZfw: string | "";
        adj: string | "";
        max: number;
        actual: number;
      };
      balanceAndSeatingCondition: {
        doi: number;
        lizfw: number;
        maczfw: number;
        litow: number;
        mactow: number;
        lilaw: number;
        maclaw: number;
      };
      loadInCompartment: {
        destinations: [
          {
            destination_name: string;
            holdDistribution: string;
            totalHoldWeight: number;
            baggageCount: number;
            baggageWeight: number;
            transferredBaggageCount: number;
            transferredBaggageWeight: number;
            cargoCount: number;
            cargoWeight: number;
            mailCount: number;
            mailWeight: number;
            eicCount: number;
            eicWeight: number;
            fktCount: number;
            fktWeight: number;
          },
        ];
      };
      passenger: {
        weight: number;
        destinations: [
          {
            destination: string;
            dhc: number;
            pad: number;
            passengerDistribution: string;
            cabinBaggageWeight: number;
          },
        ];
      };
      totalPassenger: string;
      lmc: {
        aircraftRegistration: string;
        lmcJson: [
          {
            Id: string;
            Destination: string;
            SpcType: string;
            SpcSubtype: string | null;
            SpcAmount: string;
            ClCpt: string;
            Weight: number;
          },
        ];
        ldmJson: {
          LDM: string;
          PaxWeightUsed: string;
          TaxiFuel: number;
        };
        totalPaxWeight: number;
        totalPaxPassenger: string;
        zeroFuelWeight: number;
        takeOffWeight: number;
        landingWeight: number;
        passenger: string;
        approvedBy: string;
        validatedLoadSheet: string;
      };
      loadSheetStatus: {
        aircraftRegistration: string;
        status: string;
        approvedBy: string;
        declinedBy: string | null;
        declineReason: string | null;
        created: string;
        delivered: string;
        approved: string;
        validatedLoadSheet: string;
      };
    },
  ];
}
