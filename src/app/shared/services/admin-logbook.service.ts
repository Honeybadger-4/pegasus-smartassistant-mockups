import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ILogbookEditRequest } from '@shared/models/logbook-edit-request.model';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { ILogbookSummaryResponse } from '@shared/models/logbook-summary-response.model';
import { ILogbookCrewListResponse } from '@shared/models/logbook-crew-list-response.model';
import { IGetCurrentMonthResponse } from '@shared/models/get-current-month-response.model';
import { ILogbookGetCrewListByFilterResponse } from '@shared/models/get-crews-response.model';
import { ILogbookStatusListResponse } from '@shared/models/logbook-status-list-response.model';
import {
  IDetailedListContentData,
  IDetailedListResponse,
} from '@shared/models/detailed-list-response.model';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';

@Injectable({
  providedIn: 'root',
})
export class AdminLogbookService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  constructor(private requestParamsControlService: RequestParamsControlService) {}

  getLogbookSummary(year: number): Observable<ILogbookSummaryResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/logbook-summary?year=${year}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }

  getAvailableYears(): Observable<number[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/available-years`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }

  getCrewList(
    logbookType: string,
    yearMonth: number,
    page: number,
    size: number,
    searchValue?: string | null,
    tableFilters?: {filterCompanyId: string, filterCrewFullName: string, filterApprovalStatus: string} | null,
  ): Observable<ILogbookCrewListResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/crewList`;

    let params = new HttpParams()
      .set('logbookType', logbookType)
      .set('yearMonth', yearMonth)
      .set('page', page)
      .set('size', size)

      const optionalParams: { key: string, value: any }[] = [
        { key: 'searchValue', value: searchValue },
        { key: 'filterCompanyId', value: tableFilters?.filterCompanyId },
        { key: 'filterCrewFullName', value: tableFilters?.filterCrewFullName },
        { key: 'filterApprovalStatus', value: tableFilters?.filterApprovalStatus }
      ];

      this.requestParamsControlService.paramsControl(optionalParams).map(( { key, value } ) => {
        params = params.set(key, value);
      });

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  getCrewListByFilterForCurrentMonth(
    page: number,
    size: number,
    searchValue?: string | null,
  ): Observable<ILogbookGetCrewListByFilterResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/crews/filter`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('filter', searchValue || '');

    return this.http
      .post<any>(apiUrl, null, { params })
      .pipe(map((response) => response));
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

  getCurrentMonth(companyId: number): Observable<IGetCurrentMonthResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/currentMonth?companyId=${companyId}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }

  pdfExportCurrentMonth(
    companyId: number,
    fullName: string,
    requestBody: IGetCurrentMonthResponse | null,
  ): Observable<Blob> {
    const url = `${this.baseUrl}/api/v1/admin/logbook/export-currentMonth-pdf?companyId=${companyId}&fullName=${fullName}`;
    return this.http.post(url, requestBody, { responseType: 'blob' });
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

  putEdit(requestBody: ILogbookEditRequest) {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/edit`;

    return this.http
      .put<IHttpResponseModel>(apiUrl, requestBody)
      .pipe(map((response) => response.data));
  }

  getLogByLogId(logId: number): Observable<IDetailedListContentData> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/${logId}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
