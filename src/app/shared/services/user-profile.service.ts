import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
   http = inject(HttpClient);
   baseUrl = environment.baseApi; 
   apiUrl = `${this.baseUrl}/api/v1/external/flybus/getPhoto`; 

  getProfilePhoto(): Observable<Blob> {
    return this.http.post(this.apiUrl,{}, { responseType: 'blob' });
  }
}
