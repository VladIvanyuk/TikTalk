import { avatarSizes } from '@tt/shared';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '@tt/shared';
import { ButtonComponent } from '@tt/shared';
import { SvgIconComponent } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';
import { TagComponent } from '@tt/shared';
import { meFeature, ProfileDataService } from '@tt/data-access';
import { PostsFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';

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
    PostsFeedComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly profileDataService = inject(ProfileDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly subsLoading = signal(false);
  readonly isMyPage = signal(false);

  readonly avatarSizes = avatarSizes;

  private readonly me$ = this.store.select(meFeature.selectMe);

  readonly subs$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.subsLoading.set(true);
      const method =
        id === 'me'
          ? this.profileDataService.getMySubscribers()
          : this.profileDataService.getSubscribers(id);

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
        this.isMyPage.set(true);
        return this.me$;
      }

      this.isMyPage.set(false);
      return this.profileDataService.getUser(id);
    }),
  );

  createChat(): void {
    console.log('createChat');
  }
}
