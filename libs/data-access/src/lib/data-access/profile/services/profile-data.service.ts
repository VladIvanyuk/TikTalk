import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { BASE_API_URL, Pageable } from '@tt/shared';
import { Profile } from '@tt/shared';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SearchForm, SubscribersPagination, UserUpdateData } from './model/types';

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService {
  private readonly http = inject(HttpClient);
  private readonly me = signal<Profile | null>(null);

  getProfilesData(data: SearchForm): Observable<Profile[]> {
    return this.http
      .get<
        Pageable<Profile>
      >(BASE_API_URL + `account/accounts?firstName=${data.firstName}&lastName=${data.lastName}&stack=${data.stack.join(',')}`)
      .pipe(
        map((data) => data.items),
        catchError(this.handleError),
      );
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

  updateMe(data: UserUpdateData): Observable<Profile> {
    return this.http
      .patch<Profile>(BASE_API_URL + `account/me`, data)
      .pipe(catchError(this.handleError));
  }

  updateMyProfile(data: Profile): void {
    this.me.set(data);
  }

  updateAvatar(file: File): Observable<Profile> {
    const fd = new FormData();
    fd.append('image', file);

    return this.http
      .post<Profile>(BASE_API_URL + `account/upload_image`, fd)
      .pipe(catchError(this.handleError));
  }

  get myProfile(): Signal<Profile | null> {
    return this.me.asReadonly();
  }
}
