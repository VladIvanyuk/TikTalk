import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/common/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { protectedGuard, publicGuard } from 'ngx-auth';
import { ChatsComponent } from './pages/chats/chats.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search', component: SearchComponent },
      { path: 'chats', component: ChatsComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
    ],
    canActivate: [protectedGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
];
