import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IFlightPlanModalPdfResponse } from '@shared/models/flight-plan-modal-pdf-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightPlanPdfService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getPaperFPlan(flightPlanId: string): Observable<IFlightPlanModalPdfResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/flightPlan/${flightPlanId}/paperFPlan`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}

