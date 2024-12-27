import { HttpClient } from '@angular/common/http';
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
    dateRange: string,
    page: number,
    size: number,
  ): Observable<ILoginInfoResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/login-info?dateRange=${dateRange}&page=${page}&size=${size}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
