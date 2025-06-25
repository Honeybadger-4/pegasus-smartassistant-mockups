import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IHttpResponseModel } from '@shared/models/http-response.model';

import { ILoadSheetResponse } from '@shared/models/load-sheet-response.model';
import { ILoadSheetModalsResponse } from '@shared/models/load-sheet-modals-response';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class LoadSheetService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getAllLoadSheet(
    page: number,
    size: number,
    searchValue?: string,

    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      depPort?: string;
      depDate?: string;
      version?: number;
      preparedBy?: string;
      checkedBy?: string;
      responsibleUser?: string;
      status?: string;
      approved?: string;
      replaced?: string;
      declined?: string;
      arrPort?: string;
      arrDateTime?: string;
    },
  ): Observable<ILoadSheetResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/load-sheets/search`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depPort: tableFilters?.depPort,
      depDate: tableFilters?.depDate,
      version: tableFilters?.version,
      preparedBy: tableFilters?.preparedBy,
      checkedBy: tableFilters?.checkedBy,
      responsibleUser: tableFilters?.responsibleUser,
      status: tableFilters?.status,
      approved: tableFilters?.approved,
      replaced: tableFilters?.replaced,
      declined: tableFilters?.declined,
      arrPort: tableFilters?.arrPort,
      arrDateTime: tableFilters?.arrDateTime,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }

  getLoadSheetModalInfo(id: number): Observable<ILoadSheetModalsResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/load-sheets/${id}`;
    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
