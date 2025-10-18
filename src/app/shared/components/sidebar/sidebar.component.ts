import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../common/svg-icon/svg-icon.component';
import { sidebarMenu } from './models/menu';
import { ProfileService } from '../../services/profile/profile.service';
import { UserPreviewComponent } from '../user-preview/user-preview.component';
import { firstValueFrom } from 'rxjs';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { avatarSizes } from '../../types/components.types';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    SvgIconComponent,
    UserPreviewComponent,
    AsyncPipe,
    AvatarComponent,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  readonly subscribers$ = this.profileService.getMySubscribers();
  readonly me = this.profileService.myProfile;

  readonly menu = sidebarMenu;
  readonly avatarSizes = avatarSizes;

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe()).catch((err) => console.log(err));
  }
}
