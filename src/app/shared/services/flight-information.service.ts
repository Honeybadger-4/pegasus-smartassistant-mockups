import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { map, Observable } from 'rxjs';
import { IFlightInformationResponse } from '@shared/models/flight-information-response.model';
import { IFlightInformationTripInfoResponse } from '@shared/models/flight-info-trip-info-response.model';
import { IDailyCountResponse } from '@shared/models/daily-count-response.model';
import { IKeyStatsResponse } from '@shared/models/key-stats-response.model';
import { IPersonalChecklistsResponse } from '@shared/models/personal-checklists-response.model';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';

@Injectable({ providedIn: 'root' })
export class FlightInformationService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getFlightInfo(
    page: number,
    size: number,
    startDate: string,
    endDate: string,
  ): Observable<IFlightInformationResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flights`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getFlightInformationTripInfo(
    flightISN: number,
  ): Observable<IFlightInformationTripInfoResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flights/${flightISN}/trip-info`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }

  getDailyCount(
    startDate: string,
    endDate: string,
  ): Observable<IDailyCountResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flights/daily-count`;

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getFlightInfoStats(
    startDate: string,
    endDate: string,
  ): Observable<IKeyStatsResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flights/stats`;

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getPersonalCheckList(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    tableFilters?: {
      aircraftReg: string;
      status: string;
      flightNo: string;
      checklistConfirmedBy: string;
    } | null,
  ): Observable<IPersonalChecklistsResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flights/personal-checkList`;

    let params = new HttpParams().set('page', page).set('size', size);

    const optionalParams: { key: string; value: any }[] = [
      { key: 'sortBy', value: sortBy },
      { key: 'sortDir', value: sortDir },
      { key: 'aircraftReg', value: tableFilters?.aircraftReg },
      { key: 'status', value: tableFilters?.status },
      { key: 'flightNo', value: tableFilters?.flightNo },
      {
        key: 'checklistConfirmedBy',
        value: tableFilters?.checklistConfirmedBy,
      },
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
