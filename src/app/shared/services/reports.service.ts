import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { IReportsResponse } from '@shared/models/reports-response.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getAllReports(
    page: number,
    size: number,
    searchValue?: string,
    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      depPort?: string;
      depDate?: string;
      arrPort?: string;
      arrDate?: string;
      sentBy?: number;
      sentDate?: string;
    },
  ): Observable<IReportsResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flight-reports/search`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depPort: tableFilters?.depPort,
      depDate: tableFilters?.depDate,
      arrPort: tableFilters?.arrPort,
      arrDate: tableFilters?.arrDate,
      sentBy: tableFilters?.sentBy,
      sentDate: tableFilters?.sentDate,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }
}
