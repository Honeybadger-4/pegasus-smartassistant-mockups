import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { map, Observable } from 'rxjs';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';

@Injectable({
  providedIn: 'root',
})
export class FlightInfoRoutesService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getFlightInfoRoutes(
    flightPlan_ID: string,
  ): Observable<IRouteDetailsResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/bff/flightInfo/route?flightPlanId=${flightPlan_ID}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}

