import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ISystemPropertyResponse } from '@shared/models/system-property-response.model';

@Injectable({ providedIn: 'root' })
export class SystemPropertyService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getSystemLevelSwitch(key: string): Observable<ISystemPropertyResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/system-properties`;
    const params = new HttpParams().set('key', key);

    return this.http
      .get<IHttpResponseModel>(apiUrl, { params })
      .pipe(map((response) => response.data));
  }
}
