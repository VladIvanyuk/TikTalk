import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '@tt/shared';
import { sidebarMenu } from './models/menu';
import { UserPreviewComponent } from '@tt/shared';
import { firstValueFrom, map } from 'rxjs';
import { AvatarComponent } from '@tt/shared';
import { avatarSizes } from '@tt/shared';
import { ProfileDataService } from '@tt/data-access';

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
  private readonly profileDataService = inject(ProfileDataService);
  readonly subscribers$ = this.profileDataService
    .getMySubscribers()
    .pipe(map((subscribers) => subscribers.slice(0, 3)));
  readonly me = this.profileDataService.myProfile;

  readonly menu = sidebarMenu;
  readonly avatarSizes = avatarSizes;

  ngOnInit(): void {
    firstValueFrom(this.profileDataService.getMe()).catch((err) => console.log(err));
  }
}
