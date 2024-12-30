import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { IHttpResponseModel } from "@shared/models/http-response.model";
import { ILogbookCrewListResponse } from "@shared/models/logbook-crew-list-response.model";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
    http = inject(HttpClient);
    baseUrl = environment.baseApi;

      getCrewList(
        yearMonth: string,
        page: number,
        size: number,
        searchValue?: string
      ): Observable<ILogbookCrewListResponse> {
        const apiUrl = `${this.baseUrl}/api/v1/admin/logbook/crewList`;

        let params = new HttpParams()
        .set('yearMonth', yearMonth)
        .set('page', page.toString())
        .set('size', size.toString());
    
        if (searchValue) {
            params = params.set('searchValue', searchValue);
        }
    
        return this.http
          .get<IHttpResponseModel>(apiUrl, { params })
          .pipe(map((response) => response.data));
      }
}