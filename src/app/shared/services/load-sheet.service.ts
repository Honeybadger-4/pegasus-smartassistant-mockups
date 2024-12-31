import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ILoadSheetResponse } from '@shared/models/load-sheet-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadSheetService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getLoadSheet(dateRange: string, page: number, size: number): Observable<ILoadSheetResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/load-sheets?dateRange=${dateRange}&page=${page}&size=${size}`;

    return this.http
      .get<IHttpResponseModel>(apiUrl)
      .pipe(map((response) => response.data));
  }
}
