import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ITripInfoResponse } from '@shared/models/trip-info-response.model';
import { map, Observable } from 'rxjs';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { ITripInfoDetailsResponse } from '@shared/models/trip-info-details-response.model';

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
    searchValue?: string,
    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      sentBy?: string;
      sentDate?: string;
      arrPort?: string;
      depPort?: string;
      depDate?: string;

    },
  ): Observable<ITripInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/trip-info`;
    let params = new HttpParams().set('page', page).set('size', size);

    const optionalParams: { key: string; value: any }[] = [
      { key: 'searchValue', value: searchValue },
      { key: 'acReg', value: tableFilters?.acReg },
      { key: 'flightNo', value: tableFilters?.flightNo },
      { key: 'depDate', value: tableFilters?.depDate },
      { key: 'arrPort', value: tableFilters?.arrPort },
      { key: 'depPort', value: tableFilters?.depPort },
      {
        key: 'sentBy',
        value: tableFilters?.sentBy,
      },
      { key: 'sentDate', value: tableFilters?.sentDate },
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





getTripInfoDetails(id: number): Observable<ITripInfoDetailsResponse> {
  const apiUrl = `${this.baseUrl}/api/v1/admin/trip-info/${id}`;
  return this.http
    .get<IHttpResponseModel>(apiUrl)
    .pipe(map((response) => response.data));
}

}
