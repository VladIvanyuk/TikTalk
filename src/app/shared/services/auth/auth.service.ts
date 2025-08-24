import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { Tokens } from '../../types/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  formData = new FormData();

  login(payload: { username: string; password: string }): Observable<Tokens> {
    this.formData.append('username', payload.username);
    this.formData.append('password', payload.password);

    return this.http.post<Tokens>(`${BASE_API_URL}auth/token`, this.formData);
  }
}
