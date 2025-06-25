export interface ILoadSheetModalsResponse {
  id?: number;
  legIsn?: number;
  status?: string;
  initialContent?: {
    id?: number;
    lastUpdater?: string;
    version?: number;
    acRegCode?: string;
    weightUnitType?: string;
    passengerMassType?: string;
    pantryType?: string;

    flightInfo?: {
      id?: number;
      lastUpdater?: string;
      flightISN?: number;
      airlineCode?: string;
      flightStatus?: string;
      flightNo?: string;
      flightType?: string;
      flightSuffix?: string | null;
      departurePort?: string;
      arrivalPort?: string;
      domInt?: string;
      flightDate?: number;
      flightHour?: string;
      flightDateHour?: number;
      plane?: string;
      isPreLoadSheetCreated?: null;
      isLoadSheetCreated?: null;
      cargo?: null;
      previousLeg?: null;
      nextLeg?: null;
      atd?: null;
      loadAndTrimSheets?: null;
    };

    tripInfo?: null;

    crewConfiguration?: {
      id?: number;
      lastUpdater?: string;
      name?: string;
      isDefault?: string;
      totalWeight?: number;
      totalIndex?: number;
      plane?: { data?: number; label?: string; enabled?: boolean };
      crewConfigurationItems?: Array<{
        id?: number;
        lastUpdater?: string;
        count?: number;
        crewInfo?: { data?: number; label?: string; enabled?: boolean };
        crewConfiguration?: {
          data?: number;
          label?: string;
          enabled?: boolean;
        };
      }>;
    };

    creationDate?: number;

    authorities?: {
      id?: number;
      lastUpdater?: string;
      name?: string;
      lstName?: string;
      usrname?: string;
      usremail?: string;
      autorizedType?: string;
      station?: { data?: number; label?: string; enabled?: boolean };
      usrcompany?: { data?: number; label?: string; enabled?: boolean };
      isActive?: boolean;
      lastLginDate?: number;
      isInMailGroup?: string;
      useActiveDirectory?: string;
      active?: boolean;
    };

    dow?: number;
    doi?: number;
    maltow?: number;
    mallw?: number;
    blockFuel?: number;
    taxiFuel?: number;
    tripFuel?: number;
    maleWeight?: number;
    femaleWeight?: number;
    childWeight?: number;
    infantWeight?: number;

    destinations?: Array<{
      id?: number;
      lastUpdater?: string;
      destinationOrder?: number;
      name?: string;
      transferredMaleCount?: number;
      transferredFemaleCount?: number;
      transferredChildCount?: number;
      transferredInfantCount?: number;
      transferredPADCount?: number;
      transferredDHCCount?: number;
      transferredCabinBaggageWeight?: number | null;
      maleCount?: number;
      femaleCount?: number;
      childCount?: number;
      infantCount?: number;
      padCount?: number;
      dhcCount?: number;
      cabinBaggageWeight?: number;
      transferredBaggageCount?: number;
      transferredBaggageWeight?: number;
      baggageCount?: number;
      baggageWeight?: number;
      cargoCount?: number;
      cargoWeight?: number;
      mailCount?: number;
      mailWeight?: number;
      eicCount?: number;
      eicWeight?: number;
      tbCount?: number;
      tbWeight?: number;
      tcCount?: number;
      tcWeight?: number;
      totalDiff?: null;
      rbCount?: number;
      rbWeight?: number;
      weapCount?: number;
      weapWeight?: number;
      dgrCount?: number;
      dgrWeight?: number;
      humCount?: number;
      humWeight?: number;
      avihCount?: number;
      avihWeight?: number;
      csuCount?: number;
      csuWeight?: number;
      btCount?: number;
      btWeight?: number;

      loadAndTrimSheetHold?: Array<{
        id?: number;
        lastUpdater?: string;
        holdName?: string;
        holdOrder?: number;
        holdCapacity?: number;
        arm?: number;
        indexInfPerWeightUnit?: number;
        transferredBaggageWeight?: number;
        transferredBaggageCount?: number;
        baggageCount?: number;
        baggageWeight?: number;
        cargoCount?: number;
        cargoWeight?: number;
        mailCount?: number;
        mailWeight?: number;
        eicCount?: number;
        eicWeight?: number;
        tbCount?: number;
        tbWeight?: number;
        tcCount?: number;
        tcWeight?: number;
        rbCount?: number;
        rbWeight?: number;
        weapCount?: number;
        weapWeight?: number;
        dgrCount?: number;
        dgrWeight?: number;
        humCount?: number;
        humWeight?: number;
        avihCount?: number;
        avihWeight?: number;
        csuCount?: number;
        csuWeight?: number;
        btCount?: number;
        btWeight?: number;
        cargoRest?: boolean;
        baggageRest?: boolean;
        mailRest?: boolean;
        eicRest?: boolean;
        fktRest?: boolean;
        tbRest?: boolean;
        tcRest?: boolean;
        rbRest?: boolean;
        dgrRest?: boolean;
        humRest?: boolean;
        avihRest?: boolean;
        csuRest?: boolean;
        btRest?: boolean;
        destination?: { data?: number; label?: string; enabled?: boolean };
      }>;

      loadAndTrimSheet?: null;
    }>;

    loadAndTrimSheetCabins?: Array<{
      id?: number;
      lastUpdater?: string;
      cabinOrder?: number;
      cabinName?: string;
      arm?: number;
      indexInfPerWeightUnit?: number;
      cabin?: { data?: number; label?: string; enabled?: boolean };
      passengerValue?: number;
      infantValue?: number;
      loadAndTrimSheet?: null;
    }>;

    loadAndTrimSheetPassengers?: null;
    loadAndTrimSheetTransfers?: null[];

    si?: string;
    passengerCabinBag?: number;
    totalTrafficLoad?: number;
    zeroFuelWeightActual?: number;
    takeOffWeightActual?: number;
    landingWeightActual?: number;
    lizfw?: number;
    litow?: number;
    lilaw?: number;
    maczfw?: number;
    mactow?: number;
    maclaw?: number;
    underloadBeforeLMC?: number;
    taxiWeight?: number;
    allowedTrafficLoadChoice?: string;
    isPreLoadSheet?: string;
    isManuelLoadSheet?: string;
    checkedBy?: string | null;
    approvedBy?: string;
    maxZeroFuelWeight?: number;
    aircraftVersion?: string;
    aircraftType?: string;
    crewConfigurationName?: string;
    aircraftVendor?: string;
    ldmMessage?: string;
    transitTransferInfo?: string;

    flapInfo?: {
      stapTo?: string;
      flapText?: string;
      flapValue?: string;
    };

    status?: string;
    declineReason?: string | null;
    actionDate?: number;
  };
  acReg?: string;

  lmc?: {
    totalPaxWeight?: number | null;
    totalPaxPassenger?: number | null;
    lmcJson?: {
      spcType: string;
      spcSubType: string | null;
      spcAmount: number
      clCpt: string;
      weight: number
      destination: string;
    };
  };
}
