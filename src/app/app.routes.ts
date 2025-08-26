import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/common/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { protectedGuard, publicGuard } from 'ngx-auth';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: SearchComponent },
      { path: 'profile/:id', component: ProfileComponent },
    ],
    canActivate: [protectedGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
];
