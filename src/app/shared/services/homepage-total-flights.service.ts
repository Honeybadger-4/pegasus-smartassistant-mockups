import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHomepageTotalFlightsResponse } from '@shared/models/homepage-total-flights-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomepageTotalFlightsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getFlightInfostats(
    startDate: string,
    endDate: string,
  ): Observable<IHomepageTotalFlightsResponse> {
      const apiUrl = `${this.baseUrl}/api/v1/admin/flight-info/stats`;

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
