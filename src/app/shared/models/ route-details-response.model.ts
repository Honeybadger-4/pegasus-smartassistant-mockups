export interface IRouteDetailResponse {
  routes: IRouteDetail[][];
}

export interface IRouteDetail {
  airway: string;
  wpt: string;
  mora: string | null;
  fl: string | null;
  shr: string | null;
  avtt: string;
  wv: string;
  dist: string | null;
  rd: string;
  pf: string;
  fu: string;
  rf: string | null;
  afDf: string | null;
  min: string | null;
  tw: string | null;
  atDt: string | null;
  acc: string;
}