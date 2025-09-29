import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Tokens } from '../../types/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthCookieService {
  cookie = inject(CookieService);

  getAccessToken(): string {
    return this.cookie.get('token');
  }

  getRefreshToken(): string {
    return this.cookie.get('refreshToken');
  }

  setTokens(tokens: Tokens): void {
    this.cookie.set('token', tokens.access_token);
    this.cookie.set('refreshToken', tokens.refresh_token);
  }

  clear(): void {
    this.cookie.delete('token');
    this.cookie.delete('refreshToken');
  }
}
