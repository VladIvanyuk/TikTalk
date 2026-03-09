import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Chat, ChatMessage } from './model/types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_API_URL } from '../../constants/constants';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);

  createChat(id: number): Observable<Chat> {
    return this.http.post<Chat>(BASE_API_URL + `chat/${id}`, {}).pipe(catchError(this.handleError));
  }

  getMyChats(): Observable<ChatMessage[]> {
    return this.http
      .get<ChatMessage[]>(BASE_API_URL + 'chat/get_my_chats/')
      .pipe(catchError(this.handleError));
  }

  getPersonalChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(BASE_API_URL + `chat/${id}`).pipe(
      map((chat) => {
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.profileService.myProfile()?.id
              ? chat.userSecond
              : chat.userFirst,
        };
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ChatService error:', error);
    return throwError(() => new Error(error.message));
  }
}
