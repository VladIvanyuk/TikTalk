import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '@tt/shared';
import { sidebarMenu } from './models/menu';
import { UserPreviewComponent } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';
import { avatarSizes } from '@tt/shared';
import { meFeature } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    SvgIconComponent,
    UserPreviewComponent,
    AvatarComponent,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly store = inject(Store);
  readonly subscribers = this.store.selectSignal(meFeature.selectSubscribers);
  readonly me = this.store.selectSignal(meFeature.selectMe);

  readonly menu = sidebarMenu;
  readonly avatarSizes = avatarSizes;
}
