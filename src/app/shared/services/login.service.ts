import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { IHttpResponseModel } from '@shared/models/http-response.model';
import { ILoginResponse } from '@shared/models/login-response.model';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  baseUrl = environment.baseApi;
  currentUser = signal<ILoginResponse | null>(null);
  private userDataStorageKey = 'userData';

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserData();
    }
  }

  login(username: string, password: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/api/v1/login`;

    return this.http
      .post<IHttpResponseModel>(apiUrl, { username, password }, { headers: { channel: 'WEB' } })
      .pipe(
        map((response) => {
          const data: ILoginResponse = response.data;
          this.setUserData(data);

          this.currentUser.set(data);
        }),
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.userDataStorageKey);
    }

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userDataStorageKey);
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      }
    }
  }

  private setUserData(data: ILoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userDataStorageKey, JSON.stringify(data));
    }
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const user = this.currentUser();
    if (!user || !user.efbToken) {
      return false;
    }

    const expireTime = this.getTokenExpireTime(user.efbToken);
    const now = Date.now();

    return expireTime > now;
  }

  getTokenExpireTime(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload kısmını decode et

    return payload.exp * 1000; // `exp` zamanı Unix epoch formatındadır, milisaniyeye çevir
  }
}
