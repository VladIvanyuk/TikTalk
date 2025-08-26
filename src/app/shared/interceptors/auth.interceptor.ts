import { AuthService as NgxAuthService } from 'ngx-auth';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { catchError, first, from, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const refreshInProgress = signal(false);
const delay$ = new Subject<boolean>();

export const AuthTokenInterceptor: HttpInterceptorFn = (
  req,
  next,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);

  if (authService.skipRequest(req)) {
    return next(req);
  }

  const request$ = refreshInProgress()
    ? delayRequest(authService, req)
    : addToken(authService, req);

  return request$.pipe(
    switchMap((request) => next(request)),
    catchError((res) => responseError(authService, http, req, res)),
  );
};

function addToken(authService: NgxAuthService, req: HttpRequest<any>): Observable<any> {
  return from(authService.getAccessToken()).pipe(
    first(),
    map((token) => {
      if (token) {
        return req.clone({
          setHeaders: authService.getHeaders?.(token) ?? { Authorization: `Bearer ${token}` },
        });
      }

      return req;
    }),
  );
}

function delayRequest(authService: NgxAuthService, req: HttpRequest<any>): Observable<any> {
  return delay$.pipe(
    first(),
    switchMap((canDelay) => (canDelay ? addToken(authService, req) : throwError(() => req))),
  );
}

function responseError(
  authService: NgxAuthService,
  http: HttpClient,
  req: HttpRequest<any>,
  res: HttpErrorResponse,
): Observable<HttpEvent<unknown>> {
  const refreshShouldHappen = authService.refreshShouldHappen(res, req);

  if (refreshShouldHappen && !refreshInProgress()) {
    refreshInProgress.set(true);

    from(authService.refreshToken()).subscribe({
      error: () => {
        refreshInProgress.set(false);
        delay$.next(false);
      },
      next: () => {
        refreshInProgress.set(false);
        delay$.next(true);
      },
    });
  }

  if (refreshShouldHappen && refreshInProgress()) {
    return delay$.pipe(
      first(),
      switchMap((canRetry) => (canRetry ? http.request(req) : throwError(() => res || req))),
    );
  }

  return throwError(() => res);
}
