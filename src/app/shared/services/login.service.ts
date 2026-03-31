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
  private http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  baseUrl = environment.baseApi;
  currentUser = signal<ILoginResponse | null>(null);
  private userDataStorageKey = 'userData';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserData();
    }
  }

  // --- API METHODS ---

  login(username: string, password: string): Observable<void> {
    const apiUrl = `${this.baseUrl}/api/v1/login`;

    return this.http
      .post<IHttpResponseModel>(
        apiUrl,
        { username, password },
        { headers: { channel: 'WEB' } },
      )
      .pipe(
        map((response) => {
          const data: ILoginResponse = response.data;
          this.setUserData(data);

          this.currentUser.set(data);
        }),
      );
  }

  /**
   * Kullanıcı isteğiyle çıkış: API'ye logout isteği atar (deviceId ile),
   * ardından yerel oturumu temizler ve login sayfasına yönlendirir.
   */
  logout(): void {
    const deviceId = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('deviceId') || '-'
      : '-';

    // Önce logout isteğini gönder; token hâlâ geçerli olduğundan header interceptor
    // Authorization başlığını doğru şekilde ekleyebilir.
    this.http
      .post(`${this.baseUrl}/api/v1/auth/logout`, { deviceId })
      .subscribe({ error: () => {} });

    // Ardından yerel oturumu temizle ve login'e yönlendir
    this.clearLocalSession();
    this.router.navigate(['/login']);
  }

  refreshToken(token: string): Observable<ILoginResponse> {
    const apiUrl = `${this.baseUrl}/api/v1/auth/refresh`;
    return this.http
      .post<IHttpResponseModel>(apiUrl, { refreshToken: token })
      .pipe(map((response) => response.data as ILoginResponse));
  }

  /**
   * Sunucu tarafından zorla çıkış (token geçersiz, şüpheli işlem vb.):
   * API çağrısı yapmadan yerel oturumu temizler ve login sayfasına yönlendirir.
   */
  forceLogout(): void {
    this.clearLocalSession();
    this.router.navigate(['/login']);
  }

  /**
   * Token yenileme sonrasında access ve refresh token'ları günceller.
   */
  updateTokens(efbToken: string, refreshToken: string): void {
    const user = this.currentUser();
    if (user) {
      const updatedUser: ILoginResponse = { ...user, efbToken, refreshToken };
      this.setUserData(updatedUser);
      this.currentUser.set(updatedUser);
    }
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

  private clearLocalSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.userDataStorageKey);
    }
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const user = this.currentUser();
    if (!user || !user.efbToken) {
      return false;
    }

    // Access token geçerliyse doğrudan izin ver
    const expireTime = this.getTokenExpireTime(user.efbToken);
    if (expireTime > Date.now()) {
      return true;
    }

    // Access token süresi dolmuş ama refresh token varsa geçiş izni ver;
    // interceptor ilk 401'de token yenileyecek.
    return !!user.refreshToken;
  }

  private getTokenExpireTime(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload kısmını decode et

    return payload.exp * 1000; // `exp` zamanı Unix epoch formatındadır, milisaniyeye çevir
  }
}
