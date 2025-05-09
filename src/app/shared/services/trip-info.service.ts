import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ITripInfoResponse } from '@shared/models/trip-info-response.model';
import { map, Observable } from 'rxjs';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';

@Injectable({
  providedIn: 'root',
})
export class TripInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getTripInfo(
    page: number,
    size: number,
    searchValue?: string | null,

    tableFilters?: {
      acReg: string;
      flightNo: string;
      depDateTime: string;
      sentBy: string;

      sentDateTime: string;
    } | null,
  ): Observable<ITripInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/trip-info`;

    let params = new HttpParams().set('page', page).set('size', size);

    const optionalParams: { key: string; value: any }[] = [
      { key: 'searchValue', value: searchValue },
      { key: 'acReg', value: tableFilters?.acReg },
      { key: 'depDateTime', value: tableFilters?.depDateTime },
      { key: 'flightNo', value: tableFilters?.flightNo },
      {
        key: 'sentBy',
        value: tableFilters?.sentBy,
      },
      { key: 'sentDateTime', value: tableFilters?.sentDateTime },
    ];

    this.requestParamsControlService
      .paramsControl(optionalParams)
      .map(({ key, value }) => {
        params = params.set(key, value);
      });

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
