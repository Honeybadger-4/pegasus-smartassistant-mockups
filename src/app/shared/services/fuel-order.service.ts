import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RequestParamsControlService } from './helpers-services/request-params-control.service';
import { IFuelOrderResponse } from '@shared/models/fuel-order-response.model';
import { ITotalFuelOrderedResponse } from '@shared/models/total-fuel-ordered-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class FuelOrderService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;
  requestParamsControlService = inject(RequestParamsControlService);

  getAllFuelOrder(
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
      amount?: number;
      user?: string;
      orderDate?: string;
    },
  ): Observable<IFuelOrderResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/fuel-orders/search`;

    let params = new HttpParams().set('page', page).set('size', size);

    const requestBody: any = {
      searchValue: searchValue,
      acReg: tableFilters?.acReg,
      flightNo: tableFilters?.flightNo,
      depPort: tableFilters?.depPort,
      depDate: tableFilters?.depDate,
      arrPort: tableFilters?.arrPort,
      arrDate: tableFilters?.arrDate,
      amount: tableFilters?.amount,
      user: tableFilters?.user,
      orderDate: tableFilters?.orderDate,
    };

    const cleanedBody =
      this.requestParamsControlService.requestBodyControl(requestBody);

    return this.http
      .post<IHttpResponseModel>(apiUrl, cleanedBody, { params })
      .pipe(map((response) => response.data));
  }

  getDailySum(
    startDate: string,
    endDate: string,
  ): Observable<ITotalFuelOrderedResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/fuel-orders/daily-sum`;

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
