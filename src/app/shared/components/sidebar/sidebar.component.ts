import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../common/svg-icon/svg-icon.component';
import { sidebarMenu } from './models/menu';
import { ProfileService } from '../../services/profile/profile.service';
import { Profile } from '../../types/profiles.types';
import { UserPreviewComponent } from '../user-preview/user-preview.component';

@Component({
  selector: 'app-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SvgIconComponent, UserPreviewComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  protected readonly menu = sidebarMenu;

  readonly subscribers = signal<Profile[]>([]);
  readonly firstThreeSubs = computed(() =>
    this.subscribers()
      .splice(0, 3)
      .filter((el) => Boolean(el)),
  );

  ngOnInit(): void {
    this.profileService.getMySubscribers().subscribe((data) => {
      this.subscribers.set(data.items);
    });
  }
}
