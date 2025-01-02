import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { IDetailedListResponse } from '@shared/models/detailed-list-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ILogbookCrewListResponse } from '@shared/models/logbook-crew-list-response.model';
import { map, Observable } from 'rxjs';

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
}
