export interface ILoginResponse {
  username: string;
  companyId: number;
  extendedCrewInfo: {
    crewName: string;
    crewMiddleName: string;
    crewSurname: string;
    crewSurname2: string;
    dutyType: string;
    dutyTypeDescription: string;
    cockpitCabin: string;
    active: boolean;
  };
  efbToken: string;
  refreshToken: string;
  enabledFeatures: string[];
}
