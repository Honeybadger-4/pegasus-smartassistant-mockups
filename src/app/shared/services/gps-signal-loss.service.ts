import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IGpsSignalLossResponse } from '@shared/models/gps-signal-loss-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class GpsSignalLossService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseApi;

  getImpactStats(start: string, end: string): Observable<IGpsSignalLossResponse[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    const apiUrl = `${this.baseUrl}/api/v1/admin/gps-losses/impact-stats`;

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
