import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  AUTH_SERVICE,
  AuthModule,
  PROTECTED_FALLBACK_PAGE_URI,
  PUBLIC_FALLBACK_PAGE_URI,
} from 'ngx-auth';
import { importProvidersFrom } from '@angular/core';
import { AuthService, AuthTokenInterceptor } from '@tt/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([AuthTokenInterceptor])),
    importProvidersFrom(AuthModule),
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/login' },
    { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
  ],
};
