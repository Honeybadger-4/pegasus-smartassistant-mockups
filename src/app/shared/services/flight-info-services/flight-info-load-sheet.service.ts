import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { IFlightInfoLoadSheetResponse } from '@shared/models/flight-info-response-models/flight-info-load-sheet-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightInfoLoadSheetService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getLoadAndTrimSheet(
    legIsn: number,
  ): Observable<IFlightInfoLoadSheetResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/external/flybus/loadandtrimsheet?legIsn=${legIsn}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
