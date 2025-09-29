import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../common/svg-icon/svg-icon.component';
import { sidebarMenu } from './models/menu';
import { ProfileService } from '../../services/profile/profile.service';
import { UserPreviewComponent } from '../user-preview/user-preview.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    SvgIconComponent,
    UserPreviewComponent,
    AsyncPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly profileService = inject(ProfileService);
  readonly subscribers$ = this.profileService.getMySubscribers();

  protected readonly menu = sidebarMenu;
}
