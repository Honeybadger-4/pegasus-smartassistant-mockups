import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { ICrewInformationResponse } from '@shared/models/crew-information-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class CrewInformationService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getAllCrewInformation(
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

      crewFullName?: string;
      companyId?: number;
      leg?: string;
      dutyType?: string;
      dutyStart?: string;
      addDutyTime?: string;
      pass?: boolean;
      pf?: string;
      pm?: string;
    },
  ): Observable<ICrewInformationResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flight-crews/search`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depPort: tableFilters?.depPort,
      depDate: tableFilters?.depDate,
      arrPort: tableFilters?.arrPort,
      arrDate: tableFilters?.arrDate,
      crewFullName: tableFilters?.crewFullName,
      companyId: tableFilters?.companyId,
      leg: tableFilters?.leg,
      dutyType: tableFilters?.dutyType,
      dutyStart: tableFilters?.dutyStart,
      addDutyTime: tableFilters?.addDutyTime,
      pass: tableFilters?.pass,
      pf: tableFilters?.pf,
      pm: tableFilters?.pm,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }
}
