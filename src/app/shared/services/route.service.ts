import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IRouteResponse } from '@shared/models/route-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getRoute(
    page: number,
    size: number,
    startDate: string,
    endDate: string,
    flightNo?: string | null,
    depPort?: string | null,
    arrPort?: string | null,
    username?: string | null,
  ): Observable<IRouteResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/routes`;

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
