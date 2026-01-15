import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_API_URL } from '../../constants/constants';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Tokens } from '../../types/auth';
import { AuthService as NgxAuthService } from 'ngx-auth';
import { Router } from '@angular/router';
import { AuthCookieService } from './auth-cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements NgxAuthService {
  http = inject(HttpClient);
  router = inject(Router);
  cookie = inject(AuthCookieService);

  isAuthorized(): Observable<boolean> {
    return this.getAccessToken().pipe(map((el) => !!el));
  }

  getAccessToken(): Observable<string> {
    const token = this.cookie.getAccessToken();

    return of(token);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookie.getRefreshToken();

    return this.http
      .post<Tokens>(`${BASE_API_URL}auth/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap((req) => {
          this.cookie.setTokens(req);
        }),
        catchError(async (err) => {
          await this.logout();

          return throwError(() => err);
        }),
      );
  }

  skipRequest(req: HttpRequest<any>): boolean {
    return req.url.endsWith('/refresh');
  }

  refreshShouldHappen(response: HttpErrorResponse, request?: HttpRequest<any>): boolean {
    return response.status === 403;
  }

  login(payload: { username: string; password: string }): Observable<Tokens> {
    const formData = new FormData();

    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http.post<Tokens>(`${BASE_API_URL}auth/token`, formData).pipe(
      tap((req) => {
        console.log(req);
        this.cookie.setTokens(req);
        this.router.navigateByUrl('/');
      }),
    );
  }

  logout(): void {
    this.cookie.clear();
    this.router.navigateByUrl('/login');
    location.reload();
  }
}
