export interface GetCgLimitsResponseModel {
  lw: {
    weight: number;
    weightIndex: number;
  };
  tow: {
    weight: number;
    weightIndex: number;
  };
  zfw: {
    weight: number;
    weightIndex: number;
  };
  cg1: [
    {
      weight: number;
      weightIndex: number;
    },
  ];
  cg2: [
    {
      weight: number;
      weightIndex: number;
    },
  ];
  envelopes: [CgLimitsEnvelopes];
  formulaDto: {
    id: number;
    lastUpdater: string;
    referenceStation: number;
    constantK: number;
    constantC: number;
    minimumMAC: number;
    maximumMAC: number;
    idealCG1: number;
    idealCG2: number;
    plane: null;
    planeId: number;
    lemac: number;
    mac: number;
  };
}

export interface CgLimitsEnvelopes {
  envelopeIndexType: string;
  envelopeUnits: [
    {
      envelopeType: string;
      weight: number;
      weightIndex: number;
    },
  ];
}
