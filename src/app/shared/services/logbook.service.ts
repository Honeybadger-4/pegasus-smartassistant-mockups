import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { IHttpResponseModel } from "@shared/models/http-response.model";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getUpdateableFields() {
    const apiUrl = `${this.baseUrl}/api/v1/logbook/updatable-fields?dutyType=flight`;

    return this.http
    .get<IHttpResponseModel>(apiUrl)
    .pipe(map((response) => response.data));
  }
}