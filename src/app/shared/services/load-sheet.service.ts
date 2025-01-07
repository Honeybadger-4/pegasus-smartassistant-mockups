import { HttpClient, HttpParams } from '@angular/common/http';
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

  getLoadSheet(
    startDate: string,
    endDate: string,
    page: number,
    size: number,
  ): Observable<ILoadSheetResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/load-sheets`;

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
