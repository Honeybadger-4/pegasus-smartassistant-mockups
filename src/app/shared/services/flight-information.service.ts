import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { map, Observable } from 'rxjs';
import { IFlightInformationResponse } from '@shared/models/flight-information-response.model';

@Injectable({ providedIn: 'root' })
export class FlightInformationService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getFlightInfo(
    page: number,
    size: number,
    startDate: string,
    endDate: string,
    flightNo?: string | null,
    depPort?: string | null,
    arrPort?: string | null,
    username?: string | null,
  ): Observable<IFlightInformationResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/flight-info`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (flightNo) {
      params = params.set('flightNo', flightNo);
    }
    if (depPort) {
      params = params.set('depPort', depPort);
    }
    if (arrPort) {
      params = params.set('arrPort', arrPort);
    }
    if (username) {
      params = params.set('username', username);
    }

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
