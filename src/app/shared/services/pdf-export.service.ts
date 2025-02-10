import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  http = inject(HttpClient);
  baseUrl = environment.baseApi;

  getPdfExport(companyId: number, yearMonth: string): Observable<Blob> {
    const url = `${this.baseUrl}/api/v1/monthlyLogbook/export-pdf?companyId=${companyId}&yearMonth=${yearMonth}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
