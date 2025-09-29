import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_API_URL } from '../../constants/constants';
import { Profile } from '../../types/profiles.types';
import { catchError, Observable, throwError } from 'rxjs';
import { SubscribersPagination } from './model/types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);

  getProfilesData(): Observable<Profile[]> {
    return this.http
      .get<Profile[]>(BASE_API_URL + 'account/test_accounts')
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ProfileService error:', error);
    return throwError(() => new Error('Не удалось загрузить профили'));
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(BASE_API_URL + 'account/me').pipe(catchError(this.handleError));
  }

  getMySubscribers(): Observable<SubscribersPagination> {
    return this.http
      .get<SubscribersPagination>(BASE_API_URL + 'account/subscribers/')
      .pipe(catchError(this.handleError));
  }
}
