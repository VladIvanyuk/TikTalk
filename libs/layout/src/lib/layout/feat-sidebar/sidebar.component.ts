import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '@tt/shared';
import { sidebarMenu } from './models/menu';
import { ProfileService } from '@tt/profile';
import { UserPreviewComponent } from '@tt/shared';
import { firstValueFrom, map } from 'rxjs';
import { AvatarComponent } from '@tt/shared';
import { avatarSizes } from '@tt/shared';

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
  readonly subscribers$ = this.profileService
    .getMySubscribers()
    .pipe(map((subscribers) => subscribers.slice(0, 3)));
  readonly me = this.profileService.myProfile;

  readonly menu = sidebarMenu;
  readonly avatarSizes = avatarSizes;

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe()).catch((err) => console.log(err));
  }
}
