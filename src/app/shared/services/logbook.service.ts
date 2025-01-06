import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ILogbookStatusListResponse } from '@shared/models/logbook-status-list-response.model';
import { ILogbookCrewListResponse } from '@shared/models/logbook-crew-list-response.model';
import { IDetailedListResponse } from '@shared/models/detailed-list-response.model';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getCrewList(
    yearMonth: string,
    page: number,
    size: number,
    searchValue?: string | null,
  ): Observable<ILogbookCrewListResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/crewList`;

    let params = new HttpParams()
      .set('yearMonth', yearMonth)
      .set('page', page)
      .set('size', size);

    if (searchValue) {
      params = params.set('searchValue', searchValue);
    }

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getDetailedList(
    requestBody: IDetailedListRequest,
    page: number,
    size: number,
  ): Observable<IDetailedListResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/detailedList?page=${page}&size=${size}`;

    return this.http
      .post<IHttpResponseModel>(apiUrl, requestBody)
      .pipe(map((response) => response.data));
  }

  getLogbookStatusList(): Observable<ILogbookStatusListResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/logbook-statuses`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }

  putApprove(legIds: number[]): Observable<any> {
    const joinLegIds = legIds.join(',');

    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/approve?logIds=${joinLegIds}`;

    return this.http
      .put<IHttpResponseModel>(apiUrl, null)
      .pipe(map((response) => response.data));
  }

  putReject(logId: number, reason: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/reject?logId=${logId}&reason=${reason}`;

    return this.http
      .put<IHttpResponseModel>(apiUrl, null)
      .pipe(map((response) => response.data));
  }
}
