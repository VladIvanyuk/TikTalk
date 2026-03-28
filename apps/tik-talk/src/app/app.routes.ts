import { Routes } from '@angular/router';
import { LayoutComponent } from '@tt/shared';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { protectedGuard, publicGuard } from 'ngx-auth';
import { SettingsComponent } from './pages/settings/settings.component';
import { CHAT_ROUTES } from './pages/chats/routes/routes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search', component: SearchComponent },
      { path: 'chats', loadChildren: () => CHAT_ROUTES },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
    ],
    canActivate: [protectedGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
];
