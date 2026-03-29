import { avatarSizes } from '@tt/shared';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, map, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '@tt/shared';
import { ButtonComponent } from '@tt/shared';
import { SvgIconComponent } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';
import { TagComponent } from '@tt/shared';
import { ChatService } from '@tt/chats';
import { PostsFeedComponent } from '../../../feat-posts/ui/posts-feed/posts-feed.component';
import { ProfileService } from '../../../services';

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
