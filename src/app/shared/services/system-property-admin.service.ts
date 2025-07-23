import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ISetSystemPropertyPayload } from '@shared/models/system-property-response.model';

@Injectable({ providedIn: 'root' })
export class SystemPropertyAdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseApi;

  updateSystemLevelSwitch(value: 'ON' | 'OFF') {
    const apiUrl = `${this.baseUrl}/api/v1/admin/system-properties`;
    const body: ISetSystemPropertyPayload = {
      key: 'SYSTEM_LEVEL_SWITCH',
      value,
    };
    return this.http.put(apiUrl, body);
  }
}
