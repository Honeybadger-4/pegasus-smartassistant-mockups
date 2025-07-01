import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { environment } from '@environments/environment';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

 

  getTopAlternates(
    startDate: string,
    endDate: string,
  ): Observable<ITopAlternatesResponse[]> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/routes/top-alternates`;

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
