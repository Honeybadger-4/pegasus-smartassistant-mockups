import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ILoginInfoResponse } from '@shared/models/login-info-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginInfoService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getAllLoginInfo(
    startDate: string,
    endDate: string,
    page: number,
    size: number,
  ): Observable<ILoginInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/login-info`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
