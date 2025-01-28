import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IFlightInfoFlightPlanResponse } from '@shared/models/flight-info-response-models/flight-info-flight-plan-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightInfoFlightPlanService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getflightInfoMain(
    flightPlanId: number,
    flightISN: number,
  ): Observable<IFlightInfoFlightPlanResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/bff/flightInfoMain?flightPlanId=${flightPlanId}&flightISN=${flightISN}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
