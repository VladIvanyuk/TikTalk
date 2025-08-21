import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/common/layout/layout.component';
import { SearchComponent } from './shared/components/pages/search/search.component';
import { LoginComponent } from './shared/components/pages/login/login.component';
import { ProfileComponent } from './shared/components/pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: SearchComponent },
      { path: 'profile/:id', component: ProfileComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];
