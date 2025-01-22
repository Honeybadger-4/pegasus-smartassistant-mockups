import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { IFlightInfoTripInfoResponse } from '@shared/models/flight-info-response-models/flight-info-trip-info-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightInfoTripInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getTripInfo(legIsn: number): Observable<IFlightInfoTripInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/tripInfo?legIsn=${legIsn}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
