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
      depDateTime?: string;
      receivedDateTime?: string;
      version?: string;
      responsibleUser?: string;
      status?: string;
      approvedDateTime?: string;
      replacedDateTime?: string;
      declinedDateTime?: string;
      submittedDateTime?: string;
    },
  ): Observable<IFlightPlansResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flight-plans/search`;

    let params = new HttpParams().set('page', page).set('size', size);

      const optionalParams: { key: string; value: any }[] = [
      { key: 'searchValue', value: searchValue },
      { key: 'sort', value:'desc' },
      { key: 'acReg', value: tableFilters?.acReg },
      { key: 'flightNo', value: tableFilters?.flightNo },
      { key: 'depDateTime', value: tableFilters?.depDateTime },
      { key: 'receivedDateTime', value: tableFilters?.receivedDateTime },
      { key: 'version', value: tableFilters?.version },


        { key: 'responsibleUser', value: tableFilters?.responsibleUser },
      { key: 'status', value: tableFilters?.status },
      { key: 'approvedDateTime', value: tableFilters?.approvedDateTime },
      { key: 'replacedDateTime', value: tableFilters?.replacedDateTime },
         { key: 'declinedDateTime', value: tableFilters?.declinedDateTime },
      { key: 'submittedDateTime', value: tableFilters?.submittedDateTime },

    ];

    // sadece dolu filtreleri body'ye aktar
    const body: Record<string, any> = {};
    this.requestParamsControlService
      .paramsControl(optionalParams)
      .forEach(({ key, value }) => {
        body[key] = value;
      });

    return this.http
      .post<IHttpResponseModel>(apiUrl, body, { params }) // 👈 doğru kullanım
      .pipe(map((response) => response.data));
  }
}
