import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IUserLoginHistoryResponse } from '@shared/models/user-login-history-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserLoginHistoryService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getAllUserLoginHistory(
    page: number,
    size: number,
    tableFilters?: {
      appVersion?: string;
      channel?: string;
      companyId?: number;
      deviceBrand?: string;
      deviceId?: string;
      deviceModel?: string;
      ipAddress?: string;
      loggedInDate?: string | null;
      os?: string;
      osVersion?: string;
      username?: string;
    },
  ): Observable<IUserLoginHistoryResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/login-info`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      appVersion: tableFilters?.appVersion,
      channel: tableFilters?.channel,
      companyId: tableFilters?.companyId,
      deviceBrand: tableFilters?.deviceBrand,
      deviceId: tableFilters?.deviceId,
      deviceModel: tableFilters?.deviceModel,
      ipAddress: tableFilters?.ipAddress,
      loggedInDate: tableFilters?.loggedInDate,
      os: tableFilters?.os,
      osVersion: tableFilters?.osVersion,
      username: tableFilters?.username,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }
}
