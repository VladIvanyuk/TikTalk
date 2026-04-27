import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Chat, MyChatList } from './model/types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_API_URL } from '@tt/shared';
import { ProfileDataService } from '@tt/data-access';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly profileDataService = inject(ProfileDataService);

  createChat(id: number): Observable<Chat> {
    return this.http.post<Chat>(BASE_API_URL + `chat/${id}`, {}).pipe(catchError(this.handleError));
  }

  getMyChats(): Observable<MyChatList[]> {
    return this.http
      .get<MyChatList[]>(BASE_API_URL + 'chat/get_my_chats/')
      .pipe(catchError(this.handleError));
  }

  getPersonalChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(BASE_API_URL + `chat/${id}`).pipe(
      map((chat) => {
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.profileDataService.myProfile()?.id
              ? chat.userSecond
              : chat.userFirst,
        };
      }),
      catchError(this.handleError),
    );
  }

  sendMessage(id: number, text: string): Observable<Chat> {
    return this.http
      .post<Chat>(
        BASE_API_URL + `message/send/${id}`,
        {},
        {
          params: {
            message: text,
          },
        },
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ChatService error:', error);
    return throwError(() => new Error(error.message));
  }
}
