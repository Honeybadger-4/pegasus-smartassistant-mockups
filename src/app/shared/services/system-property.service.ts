import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SystemPropertyService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseApi;

  getSystemLevelSwitch() {
    const apiUrl = `${this.baseUrl}/api/v1/system-properties`;
    const params = new HttpParams().set('key', 'SYSTEM_LEVEL_SWITCH');

    return this.http
      .get(apiUrl, { params, responseType: 'text' })
      .pipe(map((resp) => resp === 'ON'));
  }
}
