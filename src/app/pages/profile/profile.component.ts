import { avatarSizes } from './../../shared/types/components.types';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';
import { ButtonComponent } from '../../shared/components/common/button/button.component';
import { SvgIconComponent } from '../../shared/components/common/svg-icon/svg-icon.component';
import { AvatarComponent } from '../../shared/components/common/avatar/avatar.component';
import { TagComponent } from '../../shared/components/common/tag/tag.component';

@Component({
  selector: 'app-profile',
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    ButtonComponent,
    SvgIconComponent,
    AvatarComponent,
    RouterLink,
    TagComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);

  readonly subsLoading = signal(false);

  readonly avatarSizes = avatarSizes;

  private readonly me$ = toObservable(this.profileService.myProfile);

  readonly subs$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.subsLoading.set(true);
      const method =
        id === 'me'
          ? this.profileService.getMySubscribers()
          : this.profileService.getSubscribers(id);

      return method.pipe(
        map((data) => {
          return data.slice(0, 6);
        }),
        finalize(() => {
          this.subsLoading.set(false);
        }),
      );
    }),
  );

  readonly profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') {
        return this.me$;
      }

      return this.profileService.getUser(id);
    }),
  );
}
