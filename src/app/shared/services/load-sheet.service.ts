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
    page: number,
    size: number,
    startDate: string,
    endDate: string,
    acReg?: string | null,
    flightNo?: string | null,
    depPort?: string | null,
    arrPort?: string | null,
  ): Observable<ILoadSheetResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/admin/load-sheets`;

    let params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('startDate', startDate)
    .set('endDate', endDate);

  if (acReg) {
    params = params.set('acReg', acReg);
  }
  if (flightNo) {
    params = params.set('flightNo', flightNo);
  }
  if (depPort) {
    params = params.set('depPort', depPort);
  }
  if (arrPort) {
    params = params.set('arrPort', arrPort);
  }

  return this.http
    .get<IHttpResponseModel>(apiUrl, { params })
    .pipe(map((response) => response.data));
}
}
