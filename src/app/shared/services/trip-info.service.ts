import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ITripInfoResponse } from '@shared/models/trip-info-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getTripInfo(
    page: number,
    size: number,
    startDate: string,
    endDate: string,
    acReg?: string | null,
    flightNo?: string | null,
    depPort?: string | null,
    arrPort?: string | null,
  ): Observable<ITripInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/trip-info`;

    let params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('startDate', startDate)
    .set('endDate', endDate);

  if (acReg) {
    params = params.set('acReg', acReg);
  }
  if (flightNo) {
    params = params.set('flightNo', flightNo);
  }
  if (depPort) {
    params = params.set('depPort', depPort);
  }
  if (arrPort) {
    params = params.set('arrPort', arrPort);
  }

  return this.http
    .get<IHttpResponseModel>(apiUrl, { params })
    .pipe(map((response) => response.data));
}
}
