import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { IRouteDetailResponse } from '@shared/models/ route-details-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightInfoRoutesService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getFlightInfoRoutes(flightPlanId: number): Observable<IRouteDetailResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/bff/flightInfo/route?flightPlanId=${flightPlanId}`;
    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}


