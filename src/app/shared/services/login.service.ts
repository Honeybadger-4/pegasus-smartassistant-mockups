import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { IHttpResponseModel } from "@shared/models/http-response.model";
import { ILoginResponse } from "@shared/models/login-response.model";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    router = inject(Router);
    baseUrl = environment.baseApi;
    private tokenKey = 'authToken';
    isAuthenticated = signal<boolean>(this.hasToken());
    currentUserData = signal<ILoginResponse | null>(null);

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const apiUrl = `${this.baseUrl}/api/v1/login`;

        return this.http.post<IHttpResponseModel>(apiUrl, { username, password }).pipe(
            map((response) => {
                const data: ILoginResponse = response.data;
                this.setToken(data.efbToken);

                this.currentUserData.set(data);
                this.isAuthenticated.set(true);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private hasToken(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}