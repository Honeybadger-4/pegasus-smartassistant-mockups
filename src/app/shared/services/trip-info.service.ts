import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ITripInfoResponse } from '@shared/models/trip-info-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getTripInfo(page: number, size: number): Observable<ITripInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/trip-info`;

    let params = new HttpParams().set('page', page).set('size', size);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
