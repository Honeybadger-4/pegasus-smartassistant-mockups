import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ISystemPropertyAdminResponse } from '@shared/models/system-property-admin-response.model';

@Injectable({ providedIn: 'root' })
export class SystemPropertyAdminService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  updateSystemLevelSwitch(
    key: string,
    value: string,
  ): Observable<ISystemPropertyAdminResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/system-properties`;
    const body = { key, value };

    return this.http
      .put<IHttpResponseModel>(apiUrl, body)
      .pipe(map((response) => response.data));
  }
}
