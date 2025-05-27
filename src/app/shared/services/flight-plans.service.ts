import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { IFlightPlansResponse } from '@shared/models/flight-plans-response.model';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({ providedIn: 'root' })
export class FlightPlansService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getFlightPlans(
    page: number,
    size: number,
    searchValue?: string,

    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      depDate?: string;
      receivedDate?: string;
      version?: string;
      responsibleUser?: string;
      status?: string;
      approvedDate?: string;
      replacedDate?: string;
      declinedDate?: string;
      submittedDate?: string;
    },
  ): Observable<IFlightPlansResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flight-plans/search`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depDate: tableFilters?.depDate,
      receivedDate: tableFilters?.receivedDate,
      version: tableFilters?.version,
      responsibleUser: tableFilters?.responsibleUser,
      status: tableFilters?.status,
      approvedDate: tableFilters?.approvedDate,
      replacedDate: tableFilters?.replacedDate,
      declinedDate: tableFilters?.declinedDate,
      submittedDate: tableFilters?.submittedDate,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }
}
