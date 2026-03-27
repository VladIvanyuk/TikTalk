import { avatarSizes } from './../../shared/types/components.types';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';
import { ButtonComponent } from '../../shared/components/common/button/button.component';
import { SvgIconComponent } from '../../shared/components/common/svg-icon/svg-icon.component';
import { AvatarComponent } from '../../shared/components/common/avatar/avatar.component';
import { TagComponent } from '../../shared/components/common/tag/tag.component';
import { PostsFeedComponent } from './components/posts-feed/posts-feed.component';
import { ChatService } from '../../shared/services/chat/chat.service';

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
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly subsLoading = signal(false);
  readonly isMyPage = signal(false);

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
        this.isMyPage.set(true);
        return this.me$;
      }

      this.isMyPage.set(false);
      return this.profileService.getUser(id);
    }),
  );

  createChat(id: number): void {
    this.chatService
      .createChat(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((chat) => {
        this.router.navigate(['chats', chat.id]);
      });
  }
}
