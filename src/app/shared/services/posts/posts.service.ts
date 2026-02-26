import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_API_URL } from '../../constants/constants';
import { Post, PostPayloadData } from './model/types';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  sendPost(payload: PostPayloadData): Observable<Post> {
    return this.http.post<Post>(BASE_API_URL + `post/`, payload).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ProfileService error:', error);
    return throwError(() => new Error(error.message));
  }
}
