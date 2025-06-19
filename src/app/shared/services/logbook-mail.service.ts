import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ILogbookMailResponse } from '@shared/models/logbook-mail-response.model';
import { IHttpResponseModel } from '@shared/models/http-response.model';

@Injectable({
  providedIn: 'root',
})
export class LogbookMailService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  sendMail(
    companyId: number,
    yearMonth: string,
  ): Observable<ILogbookMailResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/monthlyLogbook/send-pdf-mail`;

    let params = new HttpParams()
      .set('companyId', companyId)
      .set('yearMonth', yearMonth);

    return this.http
      .post<IHttpResponseModel>(apiUrl, {}, { params })
      .pipe(map((respone) => respone.data));
  }
}
