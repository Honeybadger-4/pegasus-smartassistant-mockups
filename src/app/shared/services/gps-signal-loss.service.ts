import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IGpsSignalLossResponse } from '@shared/models/gps-signal-loss-response.model';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IGpsLossFormsResponse } from '@shared/models/gps-loss-forms-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class GpsSignalLossService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getImpactStats(
    start: string,
    end: string,
  ): Observable<IGpsSignalLossResponse[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    const apiUrl = `${this.baseUrl}/api/v1/admin/gps-losses/impact-stats`;

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getAll(
    page: number,
    size: number,
    searchValue?: string,

    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      depPort?: string;
      arrPort?: string;
      depDate?: string;
      arrDate?: string;
      firstPointName?: string;
      lastPointName?: string;
      time?: string;
      flightLevel?: string;
      flightPhase?: string;
      duration?: string;
    },
  ): Observable<IGpsLossFormsResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/gps-losses`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depPort: tableFilters?.depPort,
      arrPort: tableFilters?.arrPort,
      depDate: tableFilters?.depDate,
      arrDate: tableFilters?.arrDate,
      firstPointName: tableFilters?.firstPointName,
      lastPointName: tableFilters?.lastPointName,
      time: tableFilters?.time,
      flightLevel: tableFilters?.flightLevel,
      flightPhase: tableFilters?.flightPhase,
      duration: tableFilters?.duration,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }
}
