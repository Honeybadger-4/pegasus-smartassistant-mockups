// src/app/shared/services/bff/route-details.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';

@Injectable({ providedIn: 'root' })
export class FlightInfoRoutesService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getFlightInfoRoutes(
    flightPlanId: string,
  ): Observable<IRouteDetailsResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/bff/flightInfo/route`;
    const params = new HttpParams().set('flightPlanId', flightPlanId);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(
        map(
          (response) =>
            (response.data as { routes: IRouteDetailsResponse[] }).routes,
        ),
      );
  }
}
