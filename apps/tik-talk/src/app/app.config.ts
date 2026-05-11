import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
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
import { AuthService, AuthTokenInterceptor } from '@tt/auth';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([AuthTokenInterceptor])),
    importProvidersFrom(AuthModule),
    provideStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/login' },
    { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
  ],
};
