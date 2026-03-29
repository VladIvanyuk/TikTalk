import { Routes } from '@angular/router';
import { LayoutComponent } from '@tt/shared';
import { protectedGuard, publicGuard } from 'ngx-auth';
import { CHAT_ROUTES } from '@tt/chats';
import { SearchComponent } from '@tt/search';
import { SettingsComponent } from '@tt/settings';
import { ProfileComponent } from '@tt/profile';
import { LoginComponent } from '@tt/auth';

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
