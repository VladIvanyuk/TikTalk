import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { BASE_API_URL } from '../../constants/constants';
import { Profile } from '../../types/profiles.types';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SubscribersPagination } from './model/types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly me = signal<Profile | null>(null);

  getProfilesData(): Observable<Profile[]> {
    return this.http
      .get<Profile[]>(BASE_API_URL + 'account/test_accounts')
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ProfileService error:', error);
    return throwError(() => new Error(error.message));
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(BASE_API_URL + 'account/me').pipe(
      tap((res) => {
        this.me.set(res);
      }),
      catchError(this.handleError),
    );
  }

  getMySubscribers(): Observable<Profile[]> {
    return this.http.get<SubscribersPagination>(BASE_API_URL + 'account/subscribers/').pipe(
      map((response) => {
        return response.items.filter((subscriber) => Boolean(subscriber));
      }),
      catchError(this.handleError),
    );
  }

  getSubscribers(id: string): Observable<Profile[]> {
    return this.http.get<SubscribersPagination>(BASE_API_URL + `account/subscribers/${id}`).pipe(
      map((response) => {
        return response.items.filter((subscriber) => Boolean(subscriber));
      }),
      catchError(this.handleError),
    );
  }

  getUser(id: string): Observable<Profile> {
    return this.http.get<Profile>(BASE_API_URL + `account/${id}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  get myProfile(): Signal<Profile | null> {
    return this.me.asReadonly();
  }
}
