import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { ILicenceInfoResponse } from '@shared/models/licence-info-response.model';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({ providedIn: 'root' })
export class LicenceInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getLicenceInfo(
    page: number,
    size: number,
    sortDir: string,
    sort: string,
    search?: string,
    tableFilters?: {
      acReg?: string;
      flightNo?: string;
      checkedBy?: string;
      depDate?: string;
      checkedDate?: string;
    }
  ): Observable<ILicenceInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/licence-infos`;
    let params = new HttpParams().set('page', page).set('size', size);

    const optionalParams: { key: string; value: any }[] = [
      { key: 'search', value: search },
      { key: 'sortDir', value: sortDir },
      { key: 'sort', value: sort },
      { key: 'acReg', value: tableFilters?.acReg },
      { key: 'flightNo', value: tableFilters?.flightNo },
      { key: 'checkedBy', value: tableFilters?.checkedBy },
      { key: 'depDate', value: tableFilters?.depDate },
      { key: 'checkedDate', value: tableFilters?.checkedDate },
    ];

    this.requestParamsControlService.paramsControl(optionalParams).map(({ key, value }) => {
      params = params.set(key, value);
      
    });

     return this.http
         .get<IHttpResponseModel>(apiUrl, { params })
         .pipe(map((response) => response.data));
     }
   }
   